/**
 * Wrap up a selenium server process.
 */
var _ = require("lodash");
var selenium = require("selenium-standalone");
var log = require("./log");
var _log = log.bind(log, "[SERVER]".yellow);

// Globals
var STARTED = "Started org.openqa.jetty.jetty.Server";
var ERRORS = {
  ALREADY_RUNNING: "java.net.BindException: Selenium is already running",
  FAILED_TO_START: "Failed to start: SocketListener"
};
var SEL_LOG_COLORS = {
  " DEBUG ": "blue",
  " INFO ": "green",
  " WARN ": "orange",
  " ERROR ": "red"
};
var START_MAX_WAIT_MS = 5 * 1000;
var STOP_MAX_WAIT_MS = 5 * 1000;

var Server = module.exports = function (config) {
  this.config = config || {};
  this._process = null;
  this._isStarted = false;
  this._err = null;
};

// Detect started state.
Server.prototype._parseOutput = function (data) {
  data = (data || "").toString().trim();

  // Startup errors.
  var startErr = _.find(ERRORS, function (errText) {
    return data.indexOf(errText) > -1;
  });
  if (startErr) {
    this._process.emit("error", new Error(data));
  }

  // Detect started
  if (!this._isStarted && data.indexOf(STARTED) > -1) {
    this._isStarted = true;
    this._process.emit("started");
  }
};

// Add colors to selenium log messages.
// **Note**: Naive, but fun.
var _colorSelLog = function (data) {
  data = (data || "").toString().trim();

  _.any(SEL_LOG_COLORS, function (val, key) {
    if (data.indexOf(key) > -1) {
      data = data.split(key).join(key[val]);
      return true;
    }
  });

  return data;
};

/**
 * Start wrapper.
 */
Server.prototype.start = function (callback) {
  callback = callback || function () {};
  var self = this;
  var doLog = self.config.options.serverLogger;
  var debug = self.config.options.serverDebug;
  var timerId;

  // Verify and clean state.
  if (self._process) { return callback(new Error("Process already exists")); }
  self._err = null;

  // Ready listeners.
  var _done = _.once(function (err) {
    if (timerId) { clearTimeout(timerId); }
    if (self._process) { self._process.removeListener("started", _done); }
    self._err = err || self._err;
    callback(self._err, self._process);
  });

  // Start selenium process.
  selenium.start({
    seleniumArgs: debug ? ["-debug"] : [],
    spawnOptions: {
      stdio: "pipe"
    },
    spawnCb: function (proc) {
      // Stash running process.
      self._process = proc;

      // Communication listeners.
      proc.on("error", function (err) {
        _log("[error]".red, err.toString().trim());
        _done(err);
      });
      proc.stderr.on("data", function (data) {
        self._parseOutput(data);
        if (doLog) { _log("[stderr]", _colorSelLog(data)); }
      });
      proc.stdout.on("data", function (data) {
        self._parseOutput(data);
        if (doLog) { _log("[stdout]", _colorSelLog(data)); }
      });

      // Max wait.
      timerId = setTimeout(function () {
        _done(new Error("Server start timeout"));
      }, START_MAX_WAIT_MS);

      proc.on("started", _done);
    }
  }, function (err) {
    // Only call done if error, otherwise allow Spawn CB to finish.
    if (err) { return _done(err); }
  });
};

/**
 * Stop wrapper.
 */
Server.prototype.stop = function (callback) {
  callback = callback || function () {};
  var self = this;
  var proc = self._process;

  if (!proc || self._err) {
    return callback(self._err);
  }

  // Max wait.
  var timerId = setTimeout(function () {
    _done(new Error("Server start timeout"));
  }, STOP_MAX_WAIT_MS);

  // Done listener.
  var _done = _.once(function (codeOrErr) {
    clearTimeout(timerId);
    proc.removeListener("exit", _done);
    self._err = codeOrErr instanceof Error ? codeOrErr : self._err;
    callback(self._err);
  });

  proc.on("exit", _done);
  proc.kill();
};
