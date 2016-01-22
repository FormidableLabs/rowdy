"use strict";

/**
 * Adapter: Mocha.
 *
 * This adapter assumes you have a single server and single client (e.g.,
 * one browser session) for all your tests. Thus, you need to manually set up
 * a known state in something like a `beforeEach`.
 *
 * Gives basic global setup / teardown.
 * - `before`
 * - `beforeEach`
 * - `afterEach`
 * - `after`
 *
 * That you can call in the first-run spec file (e.g., "base").
 *
 * If this doesn't exactly fit your scenario (e.g., want a new client for
 * certain tests), then review the code here and write your own setup/teardown!
 */
var Base = require("./mocha/base");
var Client = require("./mocha/client");
var Server = require("./mocha/server");
var inherits = require("util").inherits;

/**
 * Mocha Adapter.
 *
 * @param {Object}  adapterCfg                Adapter configurations.
 * @param {Boolean} adapterCfg.client.perTest New `client` per *each* test?
 * @returns {void}
 */
var MochaAdapter = module.exports = function (adapterCfg) {
  this._client = new Client(adapterCfg);
  this._server = new Server(adapterCfg);
};

inherits(MochaAdapter, Base);

Object.defineProperty(MochaAdapter.prototype, "client", {
  get: function () {
    return this._client.client;
  }
});

/**
 * Teardown existing Selenium client and create new one.
 *
 * New client is available via `MochaAdapter.prototype.client`.
 *
 * @param {Function} callback Callback `fn(err)`
 * @returns {void}
 */
MochaAdapter.prototype.refreshClient = function (callback) {
  this._client.refreshClient(callback);
};

MochaAdapter.prototype.before = function () {
  this._server.before();
  this._client.before();
};
MochaAdapter.prototype.beforeEach = function () {
  this._server.beforeEach();
  this._client.beforeEach();
};
MochaAdapter.prototype.afterEach = function () {
  this._client.afterEach();
  this._server.afterEach();
};
MochaAdapter.prototype.after = function () {
  this._client.after();
  this._server.after();
};
