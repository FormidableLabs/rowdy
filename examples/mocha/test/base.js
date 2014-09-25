/**
 * Global setup / teardown.
 */
var rowdy = require("../../../index");
var client = rowdy.client;

// Globals
var ELEM_WAIT = 200;

// State
var allPassed = true;

// SETUP: Selenium
before(function (done) {
  rowdy.setup(done);
});

// SETUP: Client
before(function (done) {
  client
    .init(/*TODO*/)
    .setImplicitWaitTimeout(ELEM_WAIT)
    .nodeify(done);
});

// STATE: Accumulate test passes.
afterEach(function () {
  // Accumulate passed state to send to PAAS vendors (if relevant).
  allPassed = allPassed && this.currentTest.state === "passed";
});

// TEARDOWN: Client
after(function (done) {
  client
    .quit()
    // .then(function () {
    //   // Splice in passing state for Sauce Labs.
    //   // TODO: FIX THIS
    //   return config.IS_SAUCE ? client.sauceJobStatus(allPassed) : client;
    // })
    .nodeify(done);
});

// TEARDOWN: Selenium
after(function (done) {
  rowdy.teardown(done);
});
