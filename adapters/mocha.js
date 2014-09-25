/**
 * Adapter: Mocha.
 *
 * Call adapter methods in the first-run spec file (e.g., "base").
 *
 * Gives basic global setup / teardown.
 * - `before`
 * - `beforeEach`
 * - `afterEach`
 * - `after`
 *
 * So, you can expand into your own global setup.
 */
/*globals before:false, afterEach:false, after:false */
// State
var allPassed = true;

module.exports = {
  before: function () {
    var rowdy = require("../index");
    before(function (done) {
      rowdy.setup(done);
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
    after(function (done) {
      rowdy.teardown(done);
    });
  }
};
