/**
 * Global setup / teardown.
 */
var rowdy = require("../../../index");
var client = rowdy.client;

// Globals
var ELEM_WAIT = 200;

// State
var allPassed = true;

// Set up Rowdy, then client-specific options.
before(function (done) {
  rowdy.setup(done);
});
before(function (done) {
  client
    .setImplicitWaitTimeout(ELEM_WAIT)
    .nodeify(done);
});

// STATE: Accumulate test passes.
afterEach(function () {
  // TODO: SOMETHING HERE FOR SAUCE.
  // Accumulate passed state to send to PAAS vendors (if relevant).
  allPassed = allPassed && this.currentTest.state === "passed";
});

// TEARDOWN: Selenium
after(function (done) {
  rowdy.teardown(done);
});
