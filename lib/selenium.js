/**
 * Wrap up a selenium starter proc.
 */
var selenium = require("selenium-standalone");

// Singleton state.
var _server;
var isStarted = false;

// Globals
var SENTINEL = "Started org.openqa.jetty.jetty.Server";

// Detect started state.
var _detectStarted = function (data) {
  if (isStarted || data.toString().indexOf(SENTINEL) === -1) {
    return;
  }

  _server.emit("started");
  isStarted = true;
};

/**
 * Start wrapper.
 */
var start = function () {
  _server = selenium({ stdio: "pipe" });

  _server.on("error", function (data) {
    console.error("[error] " + data.toString());
  });
  _server.stderr.on("data", function (data) {
    // TODO: Should only watch stdout, not stderr.
    _detectStarted(data);
    // TODO: LOG FILE console.error("[stderr] " + data.toString());
  });

  _server.stdout.on("data", function (data) {
    _detectStarted(data);
    // TODO: LOG FILE console.log("[stdout]", data.toString());
  });
};

/**
 * Ready listener.
 */
var ready = function (cb) {
  if (isStarted) { return cb(); }

  var _started = function () {
    _server.removeListener("started", _started);
    cb();
  };

  _server.on("started", _started);
};

/**
 * Kill.
 */
var kill = function (signal) {
  if (_server) {
    _server.kill(signal);
  }
};

module.exports = {
  start: start,
  ready: ready,
  kill: kill
};
