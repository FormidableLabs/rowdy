"use strict";

var inherits = require("util").inherits;
var Base = require("../base");

/**
 * WD.js client.
 *
 * @param {Object} config Configuration object.
 * @returns {void}
 */
var Client = module.exports = function (config) {
  // Lazy require.
  var wd = require("wd"); // eslint-disable-line global-require

  // Set up a client with `remote` configuration.
  this._selClient = wd.promiseChainRemote(this._getRemote(config));

  // Apply base _last_ because we need `this.client` setup first.
  Base.apply(this, arguments);
};

inherits(Client, Base);

/**
 * Add a logger to stdout.
 *
 * @returns {void}
 */
Client.prototype._addLogger = function () {
  var self = this;
  this._selClient.on("status", function (info) {
    // Strip info.
    info = info.replace(/^\s+|\s+$/g, "");
    self.log("[status]", info.cyan);
  });
  this._selClient.on("command", function (eventType, command, response) {
    self.log("[cmd]", eventType.cyan, command, (response || "").grey);
  });
  this._selClient.on("http", function (meth, path, data) {
    self.log("[http]", meth.magenta, path, (data || "").grey);
  });
};

/**
 * Initialize underlying client with capabilities.
 *
 * @param {Object}    caps      Capabilities object.
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.init = function (caps, callback) {
  this._selClient
    .init(caps || this._config.setting.desiredCapabilities)
    .nodeify(callback);
};

/**
 * Quit underlying client.
 *
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.quit = function (callback) {
  this._selClient
    .quit()
    .nodeify(callback);
};

/**
 * Upload sauce labs "passed" status.
 *
 * @param {Boolean}   passed    All tests passed status
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.updateSauceStatus = function (passed, callback) {
  this._selClient
    .sauceJobStatus(passed)
    .nodeify(callback);
};
