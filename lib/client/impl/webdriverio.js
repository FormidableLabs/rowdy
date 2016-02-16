"use strict";

var inherits = require("util").inherits;
var _ = require("lodash");
var Base = require("../base");

/**
 * WebdriverIO client.
 *
 * @param {Object} config Configuration object.
 * @returns {void}
 */
var Client = module.exports = function (config) {
  // Lazy require.
  var webdriverio = require("webdriverio"); // eslint-disable-line global-require

  // Set up a client with `remote` configuration.
  this._selClient = webdriverio.remote(this._getRemote(config));
  this._sessionID = null;

  // Apply base _last_ because we need `this._selClient` setup first.
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
 *
 * @param {Object}    caps      Capabilities object.
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.init = function (caps, callback) {
  var self = this;
  this._selClient
    .init(caps || this._config.setting.desiredCapabilities)
    .call(function (err) {
      // Stash SessionID for Sauce Labs uploading (if available).
      self._sessionID = (self._selClient.requestHandler || {}).sessionID;
      callback(err);
    });
};

/**
 * Quit underlying client.
 *
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.quit = function (callback) {
  callback = _.once(callback);

  // The signature of `.end()` changed from `.end(callback)` to returning
  // a promise in:
  // https://github.com/webdriverio/webdriverio/blob/v3.0.0/lib/commands/end.js
  this._selClient.end()
    .then(function () {
      // Ignore selenium HTTP errors.
      callback();
    })
    // Catch real programmatic errors.
    .catch(callback);
};

/**
 * Upload sauce labs "passed" status.
 *
 * @param {Boolean}   passed    All tests passed status
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 */
Client.prototype.updateSauceStatus = function (passed, callback) {
  var SauceLabs = require("saucelabs"); // eslint-disable-line global-require

  // Bail if we don't have a stashed session id.
  var sessionID = this._sessionID;
  if (!sessionID) { return callback(); }

  // Manually update sauce labs with stashed SessionID.
  // See: https://github.com/webdriverio/webdriverio/issues/374
  var sauceAccount = new SauceLabs({
    username: this._config.setting.remote.user,
    password: this._config.setting.remote.key
  });

  sauceAccount.updateJob(sessionID, {
    passed: passed,
    public: true
  }, callback);
};
