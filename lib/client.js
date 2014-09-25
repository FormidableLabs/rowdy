/**
 * Client (browser) wrapper.
 */
var wd = require("wd");
require("colors");

var _client;

/**
 * Add a logger to stdout.
 */
var _addLogger = function (client) {
  client.on("status", function(info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    console.log("[status] " + info.cyan);
  });
  client.on("command", function(eventType, command, response) {
    console.log("[cmd] " + eventType.cyan, command, (response || "").grey);
  });
  client.on("http", function(meth, path, data) {
    console.log("[http] " + meth.magenta, path, (data || "").grey);
  });
};

/**
 * Cache and return a client.
 */
module.exports = function (config) {
  if (_client) { return _client; }

  // Set up a client.
  var cfg = config.remote || {};
  _client = wd.promiseChainRemote(cfg.host, cfg.port, cfg.user, cfg.key);

  // Set up extra logging.
  if (config.options.clientLogger) {
    _addLogger(_client);
  }

  return _client;
};
