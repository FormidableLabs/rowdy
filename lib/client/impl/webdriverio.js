var inherits = require("util").inherits;
var Base = require("../base");

/**
 * WebdriverIO client.
 *
 * @param {Object} config Configuration object.
 */
var Client = module.exports = function (config) {
  // Lazy require.
  var webdriverio = require("webdriverio");

  // Set up a client with `remote` configuration.
  this._selClient = webdriverio.remote(config.setting.remote || {});

  // Apply base _last_ because we need `this._selClient` setup first.
  Base.apply(this, arguments);
};

inherits(Client, Base);

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {
  var self = this;
  this._selClient.on("init", function (obj) {
    self.log("[init]", obj.sessionID.grey);
  });
  this._selClient.on("command", function (obj) {
    self.log("[cmd]", (obj.method || "GET").cyan, obj.uri.path,
      JSON.stringify(obj.data).grey);
  });
  this._selClient.on("result", function (obj) {
    var req = obj.requestOptions;
    self.log("[result]", (req.method || "GET").magenta, req.uri.path,
      JSON.stringify(obj.body).grey);
  });
};

/**
 * Initialize underlying client with capabilities.
 */
Client.prototype.init = function (/*caps*/) {};

