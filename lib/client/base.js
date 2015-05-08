/**
 * Abstract base client (browser) wrapper.
 */
var wd = require("wd");
var log = require("../log");

/**
 * Cache and return a client.
 *
 * @param {Object} config Configuration object.
 */
var Client = module.exports = function (config) {
  // Set up a client with `remote` configuration.
  this.client = wd.promiseChainRemote(config.setting.remote || {});

  // Set up extra logging.
  if (config.options.clientLogger) {
    this._addLogger();
  }
};

// Instance props.
Client.prototype.log = log.bind(log, "[CLIENT]".green);

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {
  this.client.on("status", function (info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    Client.log("[status]", info.cyan);
  });
  this.client.on("command", function (eventType, command, response) {
    Client.log("[cmd]", eventType.cyan, command, (response || "").grey);
  });
  this.client.on("http", function (meth, path, data) {
    Client.log("[http]", meth.magenta, path, (data || "").grey);
  });
};
