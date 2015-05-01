/**
 * Client (browser) wrapper.
 */
var webdriverio = require("webdriverio");
var log = require("./log");
var _log = log.bind(log, "[CLIENT]".green);

/**
 * Cache and return a client.
 */
var Client = module.exports = function (config, setting) {
  // Set up a client with `remote` configuration.
  this.client = webdriverio.remote(setting.remote || {});

  // Set up extra logging.
  if (config.options.clientLogger) {
    this._addLogger();
  }
};

// Static props.
Client.LOG = _log;

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {
  this.client.on("init", function (eventType, obj) {
    _log("[init]", eventType.cyan, (obj || "").grey);
  });
  this.client.on("command", function (eventType, obj) {
    _log("[cmd]", eventType.cyan, (obj || "").grey);
  });
  this.client.on("result", function (eventType, obj) {
    _log("[result]", eventType.magenta, (obj.response || "").grey);
  });
};
