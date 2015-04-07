/**
 * Global setup / teardown.
 */
var rowdy = require("../../../index");
var adapter = rowdy.adapters.mocha;
var client;

// Globals
var ELEM_WAIT = 200;

adapter.before();
before(function (done) {
  adapter.getClient(function (err, clientObj) {
    client = clientObj;
    done(err);
  });
});
before(function (done) {
  client
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
  client
    .clearLocalStorage()
    .nodeify(done);
});

adapter.after();

