/**
 * Wrap up a selenium server process.
 */
var _ = require("lodash");
var selenium = require("selenium-standalone");
var log = require("./log");
var _log = log.bind(log, "[SERVER]".yellow);

// Globals
var SENTINEL = "Started org.openqa.jetty.jetty.Server";

var Server = module.exports = function (config) {
  this.config = config || {};
  this._process = null;
  this._isStarted = false;
};

// Detect started state.
Server.prototype._detectStarted = function (data) {
  if (this._isStarted || data.toString().indexOf(SENTINEL) === -1) {
    return;
  }

  this._process.emit("started");
  this._isStarted = true;
  this._err = null;
};

/**
 * Start wrapper.
 */
Server.prototype.start = function (callback) {
  callback = callback || function () {};
  var self = this;
  var doLog = !!self.config.options.serverLogger;

  // Verify and clean state.
  if (self._process) { return callback(new Error("Process already exists")); }
  self._err = null;

  // Start selenium process.
  var proc = self._process = selenium({ stdio: "pipe" });

  // Communication listeners.
  proc.on("error", function (err) {
    _log("[error]".red, err.toString().trim());
    self._err = err;
    _done();
  });
  proc.stderr.on("data", function (data) {
    self._detectStarted(data);
    if (doLog) { _log("[stderr]", data.toString().trim()); }
  });

  proc.stdout.on("data", function (data) {
    self._detectStarted(data);
    if (doLog) { _log("[stdout]", data.toString().trim()); }
  });

  // Ready listeners.
  var _done = _.once(function () {
    // TODO: `setTimeout` for max wait?
    proc.removeListener("started", _done);
    callback(self._err, proc);
  });

  proc.on("started", _done);
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

  var _done = _.once(function () {
    // TODO: `setTimeout` for max wait?
    proc.removeListener("exit", _done);
    callback(self._err);
  });

  proc.on("exit", _done);
  proc.kill();
};
