/**
 * Client (browser) wrapper.
 */
var wd = require("wd");
var log = require("./log");

var _client;

/**
 * Add a logger to stdout.
 */
var _addLogger = function (client) {
  client.on("status", function(info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    log("[status] " + info.cyan);
  });
  client.on("command", function(eventType, command, response) {
    log("[cmd] " + eventType.cyan, command, (response || "").grey);
  });
  client.on("http", function(meth, path, data) {
    log("[http] " + meth.magenta, path, (data || "").grey);
  });
};

/**
 * Cache and return a client.
 */
module.exports = function (config, setting) {
  if (_client) { return _client; }

  // Set up a client with `remote` configuration.
  _client = wd.promiseChainRemote(setting.remote || {});

  // Set up extra logging.
  if (config.options.clientLogger) {
    _addLogger(_client);
  }

  return _client;
};
