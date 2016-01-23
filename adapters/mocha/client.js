"use strict";
/*globals before:false, beforeEach:false, afterEach:false, after:false*/

var Base = require("./base");
var inherits = require("util").inherits;

/**
 * Client adapter.
 *
 * @param {Object}  adapterCfg          Specific configurations for adapter.
 * @param {Boolean} adapterCfg.perTest  New `client` per *each* test? (`false`)
 * @returns {void}
 */
var Client = module.exports = function () {
  Base.apply(this, arguments);

  // Test configuration perTest or perSuite client?
  var cfg = this.adapterCfg;
  this._perTest = !!(cfg && cfg.client && cfg.client.perTest);
  this._perSuite = !this._perTest;

  // Stash the client reference to pass on.
  this._client = null;

  // Test state.
  this._failed = 0;
};

inherits(Client, Base);

Object.defineProperty(Client.prototype, "client", {
  /**
   * Return Selenium client.
   *
   * @returns {Object} Underlying Selenium client instance.
   */
  get: function () {
    if (!this._client) { throw new Error("Client is unset"); }
    return this._client.selClient;
  }
});

Client.prototype._setupClient = function (callback) {
  var rowdy = require("../../index"); // eslint-disable-line global-require
  var self = this;

  rowdy.setupClient(function (err, client) {
    if (err) { return callback(err); }
    self._client = client;
    callback();
  });
};

/**
 * Tear down the underlying client.
 *
 * **Note**: Also flushes current SauceLabs status, which is a running
 * accumulationg of "all tests have passed at this point" so that we can handle
 * different SL client correctly updating results.
 *
 * @param {Function}  callback  Callback `fn(err)`
 * @returns {void}
 * @api private
 */
Client.prototype._teardownClient = function (callback) {
  var rowdy = require("../../index"); // eslint-disable-line global-require
  var self = this;

  if (!self._client) { return callback(); }

  if (self.config.setting.isSauceLabs) {
    var passed = self._failed === 0;

    // Call SL first, then teardown.
    return self._client.updateSauceStatus(passed, function (err) {
      if (err) { return callback(err); }
      rowdy.teardownClient(self._client, callback);
    });
  }

  // Straight teardown.
  rowdy.teardownClient(self._client, callback);
};

Client.prototype.refreshClient = function (callback) {
  this._teardownClient(function (err) {
    /*eslint-disable no-invalid-this*/
    if (err) { return callback(err); }
    this._setupClient(callback);
  }.bind(this));
};

Client.prototype.before = function () {
  var self = this;

  before(function (done) {
    if (self._perSuite) { return self._setupClient(done); }
    done();
  });
};

Client.prototype.beforeEach = function () {
  var self = this;

  beforeEach(function (done) {
    if (self._perTest) { return self._setupClient(done); }
    done();
  });
};

Client.prototype.afterEach = function () {
  var self = this;

  afterEach(function (done) {
    self._failed += this.currentTest.state === "passed" ? 0 : 1;

    if (self._perTest) { return self._teardownClient(done); }
    done();
  });
};

Client.prototype.after = function () {
  var self = this;

  after(function (done) {
    if (self._perSuite) { return self._teardownClient(done); }
    done();
  });
};
