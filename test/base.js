/**
 * Global setup / teardown.
 */
var sel = require("../lib/selenium");
var config = require("../lib/config");
var client = require("../lib/browser").getClient();

// State
var allPassed = true;

// SETUP: Selenium
before(function (done) {
  if (config.IS_SAUCE) {
    return done();
  }

  sel.ready(done);
});

// SETUP: Client
before(function (done) {
  client
    .init(config.get().desiredCapabilities)
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
