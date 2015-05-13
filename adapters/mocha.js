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
var inherits = require("util").inherits;
var wrapCfg = require("../lib/config");

/**
 * Base (noop) adapter.
 */
var Base = function (config) {
  this.config = wrapCfg(config || require("../config"))
};

Base.prototype = {
  before: function () {},
  beforeEach: function () {},
  afterEach: function () {},
  after: function () {}
};

/**
 * Server adapter.
 */
var Server = function () {
  Base.apply(this, arguments);
  this.server = null;
};

inherits(Server, Base);

Server.prototype.before = function () {
  var rowdy = require("../index");
  var self = this;

  before(function (done) {
    console.log

    // Check if actually using server.
    if (!(self.config.setting.server || {}).start) {
      return done();
    }

    rowdy.setupServer(function (err, server) {
      if (err) { return done(err); }
      self.server = server;
      done();
    });
  });
};

Server.prototype.after = function () {
  var rowdy = require("../index");
  var self = this;

  after(function (done) {
    if (!self.server) { return done(); }
    rowdy.teardownServer(self.server, done);
  });
};


/**
 * Client adapter.
 */
var Client = function () {
  Base.apply(this, arguments);
  this._client = null;
  this._attempted = 0;
  this._passed = 0;
  this._finished = 0;
};

inherits(Client, Base);

Object.defineProperty(Client.prototype, "client", {
  get: function () {
    if (!this._client) { throw new Error("Client is unset"); }
    return this._client;
  }
});

Client.prototype.before = function () {
  var rowdy = require("../index");
  var self = this;

  before(function (done) {
    rowdy.setupClient(function (err, client) {
      if (err) { return done(err); }
      self._client = client;
      done();
    });
  });
};

Client.prototype.beforeEach = function () {
  var self = this;

  beforeEach(function () {
    self._attempted++;
  });
};

Client.prototype.afterEach = function () {
  var self = this;

  beforeEach(function () {
    self._passed += this.currentTest.state === "passed" ? 1 : 0;
    self._finished++;
  });
};

Client.prototype.after = function () {
  var rowdy = require("../index");
  var self = this;

  // Handle SauceLabs accumulation.
  after(function (done) {
    var passed = self._attempted === self._passed &&
      self._attempted === self._finished;

    if (self._client && self.config.setting.isSauceLabs) {
      return self._client
        .sauceJobStatus(passed)
        .nodeify(done);
    }

    // Default.
    done();
  });

  // Teardown client.
  after(function (done) {
    if (!self._client) { return done(); }
    rowdy.teardownClient(self._client, done);
  });
};

module.exports = {
  Server: Server,
  Client: Client
};
