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
var allPassed = true;

module.exports = {
  /**
   * Setup server, then client.
   */
  before: function () {
    var rowdy = require("../index");

    // Setup server, then client.
    before(function (done) {
      rowdy.setupServer(function () {
        rowdy.setupClient(done);
      });
    });
  },

  beforeEach: function () {},

  afterEach: function () {
    afterEach(function () {
      // Accumulate passed state to send to PAAS vendors (if relevant).
      allPassed = allPassed && this.currentTest.state === "passed";
    });
  },

  after: function () {
    var rowdy = require("../index");

    // Handle SauceLabs accumulation.
    after(function (done) {
      if (rowdy.setting.isSauceLabs) {
        return rowdy.client
          .sauceJobStatus(allPassed)
          .nodeify(done);
      }

      // Default.
      done();
    });

    // Teardown client, then server.
    after(function (done) {
      rowdy.teardownClient(function () {
        rowdy.teardownServer(done);
      });
    });
  }
};
