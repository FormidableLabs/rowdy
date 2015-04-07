/**
 * Wrap up a selenium server process.
 */
var selenium = require("selenium-standalone");

// Globals
var SENTINEL = "Started org.openqa.jetty.jetty.Server";

var Server = module.exports = function () {
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
};

/**
 * Start wrapper.
 */
Server.prototype.start = function (callback) {
  callback = callback || function () {};
  var self = this;
  var proc = this._process = selenium({ stdio: "pipe" });

  // Communication listeners.
  proc.on("error", function (data) {
    // TODO: proxy errors.
    console.error("[error] " + data.toString());
  });
  proc.stderr.on("data", function (data) {
    // TODO: Should only watch stdout, not stderr.
    self._detectStarted(data);
    // TODO: LOG FILE console.error("[stderr] " + data.toString());
  });

  proc.stdout.on("data", function (data) {
    self._detectStarted(data);
    // TODO: LOG FILE console.log("[stdout]", data.toString());
  });

  // Ready listeners.
  var _started = function () {
    // TODO: `setTimeout` for max wait?
    proc.removeListener("started", _started);
    callback(null, proc);
  };

  proc.on("started", _started);
};

/**
 * Stop wrapper.
 */
Server.prototype.stop = function (callback) {
  callback = callback || function () {};
  var proc = this._process;

  if (!proc) {
    return callback();
  }

  var _stopped = function () {
    // TODO: `setTimeout` for max wait?
    proc.removeListener("exit", _stopped);
    callback();
  };

  proc.on("exit", _stopped);
  proc.kill();
};
