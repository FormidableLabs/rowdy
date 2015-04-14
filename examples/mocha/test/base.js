/**
 * Global setup / teardown.
 */
var adapter = require("../../../index").adapters.mocha;

// Globals
var ELEM_WAIT = 200;

adapter.before();
before(function (done) {
  adapter.client
    // Global wait.
    .setImplicitWaitTimeout(ELEM_WAIT)

    // Get the page a first time so that we can set LS.
    .get("http://backbone-testing.com/notes/app/")
    .clearLocalStorage()

    .nodeify(done);
});

adapter.beforeEach();

adapter.afterEach();
afterEach(function (done) {
  // Clear all LS to start from scratch.
  // Note: Should come *after* not before browser window / session begins.
  // See: http://stackoverflow.com/questions/21259235
  adapter.client
    .clearLocalStorage()
    .nodeify(done);
});

adapter.after();

