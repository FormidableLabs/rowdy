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
/*globals before:false, afterEach:false, after:false */
var Base = require("./mocha/base");
var Client = require("./mocha/client");
var Server = require("./mocha/server");
var inherits = require("util").inherits;

var MochaAdapter = module.exports = function (config, overrides) {
  this._client = new Client(config, overrides);
  this._server = new Server(config, overrides);
};

inherits(MochaAdapter, Base);

Object.defineProperty(MochaAdapter.prototype, "client", {
  get: function () {
    return this._client.client;
  }
});

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
