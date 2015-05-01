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

var adapter = module.exports = {
  before: function () {
    var rowdio = require("../index");

    // Setup server, then client.
    before(function (done) {
      // Check if actually using server.
      if (!(rowdio.setting.server || {}).start) {
        return done();
      }

      rowdio.setupServer(function (err, server) {
        if (err) { return done(err); }
        _server = server;
        done();
      });
    });

    before(function (done) {
      rowdio.setupClient(function (err, client) {
        if (err) { return done(err); }
        _client = client;
        done();
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
    var rowdio = require("../index");

    // Handle SauceLabs accumulation.
    after(function (done) {
      if (_client && rowdio.setting.isSauceLabs) {
        return _client
          .sauceJobStatus({
            passed: allPassed && attempted === finished,
            public: true
          })
          .end(done);
      }

      // Default.
      done();
    });

    // Teardown client, then server.
    after(function (done) {
      if (!_client) { return done(); }
      rowdio.teardownClient(_client, done);
    });
    after(function (done) {
      if (!_server) { return done(); }
      rowdio.teardownServer(_server, done);
    });
  }
};

/**
 * Return configured WebdriverIO client.
 *
 * **Note**: `adapter.before()` **must** be called before accessing this
 * property.
 */
Object.defineProperty(adapter, "client", {
  get: function () {
    if (!_client) { throw new Error("Client is unset"); }
    return _client;
  }
});
