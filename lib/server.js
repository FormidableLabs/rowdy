/**
 * Wrap up a selenium server process.
 */
var _ = require("lodash");
var log = require("./log");
var _log = log.bind(log, "[SERVER]".yellow);

// Globals
var STARTED = "Started org.openqa.jetty.jetty.Server";
var ERRORS = {
  ALREADY_RUNNING: "java.net.BindException: Selenium is already running",
  FAILED_TO_START: "Failed to start: SocketListener",
  EXECUTE_EXCEPTION: "org.apache.commons.exec.ExecuteException"
};
var SEL_LOG_COLORS = {
  " DEBUG ": "blue",
  " INFO ": "green",
  " WARN ": "orange",
  " ERROR ": "red"
};

var Server = module.exports = function (config) {
  this.config = config || {};
  this._process = null;
  this._isStarted = false;
  this._err = null;
};

// Static props.
Server.log = _log;

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
 *
 * @param {Function} callback Callback `fn(err, proc)` with server process
 */
// TODO: Refactor and decompose out the `max-statements` warning.
/*eslint-disable max-statements*/
Server.prototype.start = function (callback) {
  var selenium = require("selenium-standalone");

  callback = callback || function () {};

  var self = this;
  var doLog = self.config.options.server.logger;
  var debug = self.config.options.server.debug;
  var startTimeout = self.config.options.server.startTimeout;

  var phantomPath = self.config.setting.server.phantomPath;
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
    seleniumArgs: [].concat(
      debug ? ["-debug"] : [],
      phantomPath ? ["-Dphantomjs.binary.path=" + phantomPath] : []
    ),
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
      }, startTimeout);

      proc.on("started", _done);
    }
  }, function (err) {
    // Only call done if error, otherwise allow Spawn CB to finish.
    if (err) { return _done(err); }
  });
};

/**
 * Stop wrapper.
 *
 * @param {Function} callback Callback `fn(err)` when stopped
 * @returns {void}
 */
Server.prototype.stop = function (callback) {
  callback = callback || function () {};
  var self = this;
  var stopTimeout = self.config.options.server.stopTimeout;
  var proc = self._process;
  var _done;

  if (!proc || self._err) {
    return callback(self._err);
  }

  // Max wait.
  var timerId = setTimeout(function () {
    _done(new Error("Server start timeout"));
  }, stopTimeout);

  // Done listener.
  _done = _.once(function (codeOrErr) {
    clearTimeout(timerId);
    proc.removeListener("exit", _done);
    self._err = codeOrErr instanceof Error ? codeOrErr : self._err;
    callback(self._err);
  });

  proc.on("exit", _done);
  proc.kill();
};
/*eslint-enable max-statements*/
