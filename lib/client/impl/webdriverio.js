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
 *
 * @param {Object}    caps      Capabilities object.
 * @param {Function}  callback  Callback `fn(err)`
 */
Client.prototype.init = function (caps, callback) {
  this._selClient
    .init(caps || this._config.setting.desiredCapabilities)
    .call(callback);
};

/**
 * Quit underlying client.
 *
 * @param {Function}  callback  Callback `fn(err)`
 */
Client.prototype.quit = function (callback) {
  this._selClient.end(callback);
};

/**
 * Upload sauce labs "passed" status.
 *
 * @param {Boolean}   passed    All tests passed status
 * @param {Function}  callback  Callback `fn(err)`
 */
Client.prototype.updateSauceStatus = function (passed, callback) {
  var SauceLabs = require("saucelabs");

  // Manually update sauce labs.
  // See: https://github.com/webdriverio/webdriverio/issues/374
  var sessionID = this._selClient.requestHandler.sessionID;
  var sauceAccount = new SauceLabs({
    username: this._config.setting.remote.user,
    password: this._config.setting.remote.key
  });

  sauceAccount.updateJob(sessionID, {
    passed: passed,
    public: true
  }, callback);
};
