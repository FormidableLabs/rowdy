/**
 * Wrap up a selenium starter proc.
 */
var selenium = require("selenium-standalone");

// Singleton state.
var server;
var isStarted = false;

// Globals
var SENTINEL = "Started org.openqa.jetty.jetty.Server";

// Detect started state.
var _detectStarted = function (data) {
  if (isStarted || data.toString().indexOf(SENTINEL) === -1) {
    return;
  }

  server.emit("started");
  isStarted = true;
};

/**
 * Start wrapper.
 */
var start = function () {
  server = selenium({ stdio: "pipe" });

  server.on("error", function (data) {
    console.error("[error] " + data.toString());
  });
  server.stderr.on("data", function (data) {
    // TODO: Should only watch stdout, not stderr.
    _detectStarted(data);
    // TODO: LOG FILE console.error("[stderr] " + data.toString());
  });

  server.stdout.on("data", function (data) {
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
    server.removeListener("started", _started);
    cb();
  };

  server.on("started", _started);
};

/**
 * Kill.
 */
var kill = function (signal) {
  if (server) {
    server.kill(signal);
  }
};

module.exports = {
  server: server,
  start: start,
  ready: ready,
  kill: kill
};
