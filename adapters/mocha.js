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
// State
var _client = null;
var _server = null;
var attempted = 0;
var finished = 0;
var allPassed = true;

module.exports = {
  /**
   * Setup server, then client.
   */
  before: function () {
    var rowdy = require("../index");

    // Setup server, then client.
    before(function (done) {
      rowdy.setupServer(function (serverErr, server) {
        if (serverErr) { return done(serverErr); }
        _server = server;
        rowdy.setupClient(function (clientErr, client) {
          if (clientErr) { return done(clientErr); }
          _client = client;
          done();
        });
      });
    });
  },

  beforeEach: function () {
    beforeEach(function () {
      attempted++;
    });
  },

  afterEach: function () {
    afterEach(function () {
      // Accumulate passed state to send to PAAS vendors (if relevant).
      allPassed = allPassed && this.currentTest.state === "passed";
      finished++;
    });
  },

  after: function () {
    var rowdy = require("../index");

    // Handle SauceLabs accumulation.
    after(function (done) {
      if (_client && rowdy.setting.isSauceLabs) {
        return _client
          .sauceJobStatus(allPassed && attempted === finished)
          .nodeify(done);
      }

      // Default.
      done();
    });

    // Teardown client, then server.
    after(function (done) {
      if (!_client) { return done(); }
      rowdy.teardownClient(_client, done);
    });
    after(function (done) {
      if (!_server) { return done(); }
      rowdy.teardownServer(_server, done);
    });
  },

  getClient: function (callback) {
    if (!_client) { return callback(new Error("Client is unset")); }
    callback(null, _client);
  },

  getServer: function (callback) {
    if (!_server) { return callback(new Error("Server is unset")); }
    callback(null, _server);
  }
};


