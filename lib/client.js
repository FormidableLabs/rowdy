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
  this.client.on("init", function (obj) {
    _log("[init]", obj.sessionID.grey);
  });
  this.client.on("command", function (obj) {
    _log("[cmd]", (obj.method || "GET").cyan, obj.uri.path,
      JSON.stringify(obj.data).grey);
  });
  this.client.on("result", function (obj) {
    var req = obj.requestOptions;
    _log("[result]", (req.method || "GET").magenta, req.uri.path,
      JSON.stringify(obj.body).grey);
  });
};
