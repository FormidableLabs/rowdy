/**
 * Global setup / teardown.
 */
var sel = require("../../../lib/selenium");
var client = require("../../../index").client;
console.log("TODO HERE", JSON.stringify(client, null, 2));
throw new Error("HI");
var client = require("../../../lib/browser").getClient();

// Globals
var ELEM_WAIT = 200;

// State
var allPassed = true;

// SETUP: Selenium
before(function (done) {
  if (config.IS_SAUCE) {
    return done();
  }

  // Start selenium and wait until ready.
  sel.start();
  sel.ready(done);
});

// SETUP: Client
before(function (done) {
  client
    .init(config.get().desiredCapabilities)
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
    .then(function () {
      // Splice in passing state for Sauce Labs.
      return config.IS_SAUCE ? client.sauceJobStatus(allPassed) : client;
    })
    .nodeify(done);
});

// TEARDOWN: Selenium
after(function () {
  if (config.IS_SAUCE) {
    return;
  }

  sel.kill();
});
