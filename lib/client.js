/**
 * Client (browser) wrapper.
 */
var wd = require("wd");
var log = require("./log");
var _log = log.bind(log, "[CLIENT]".green);

/**
 * Cache and return a client.
 */
var Client = module.exports = function (config, setting) {
  // Set up a client with `remote` configuration.
  this.client = wd.promiseChainRemote(setting.remote || {});

  // Set up extra logging.
  if (config.options.clientLogger) {
    this._addLogger();
  }
};

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {
  this.client.on("status", function(info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    _log("[status]", info.cyan);
  });
  this.client.on("command", function(eventType, command, response) {
    _log("[cmd]", eventType.cyan, command, (response || "").grey);
  });
  this.client.on("http", function(meth, path, data) {
    _log("[http]", meth.magenta, path, (data || "").grey);
  });
};
