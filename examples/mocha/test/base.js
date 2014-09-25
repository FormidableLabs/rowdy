/**
 * Global setup / teardown.
 */
var rowdy = require("../../../index");
var client = rowdy.client;
var sel = rowdy.server;
console.log("TODO HERE", JSON.stringify(rowdy.config, null, 2));
var desiredCapabilities = rowdy.config.desiredCapabilities;

// Globals
var ELEM_WAIT = 200;

// State
var allPassed = true;

// SETUP: Selenium
before(function (done) {
  // Start selenium and wait until ready.
  sel.start();
  sel.ready(done);
});

// SETUP: Client
before(function (done) {
  client
    .init(desiredCapabilities)
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
after(function () {
  sel.kill();
});
