var inherits = require("util").inherits;
var Base = require("../base");

/**
 * WD.js client.
 *
 * @param {Object} config Configuration object.
 */
var Client = module.exports = function (config) {
  // Lazy require.
  var wd = require("wd");

  // Set up a client with `remote` configuration.
  this.client = wd.promiseChainRemote(config.setting.remote || {});

  // Apply base _last_ because we need `this.client` setup first.
  Base.apply(this, arguments);
};

inherits(Client, Base);

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {
  var self = this;
  this.client.on("status", function (info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    self.log("[status]", info.cyan);
  });
  this.client.on("command", function (eventType, command, response) {
    self.log("[cmd]", eventType.cyan, command, (response || "").grey);
  });
  this.client.on("http", function (meth, path, data) {
    self.log("[http]", meth.magenta, path, (data || "").grey);
  });
};
