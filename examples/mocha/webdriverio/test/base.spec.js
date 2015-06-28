/**
 * Global setup / teardown.
 */
var adapter = global.adapter;

// Global wait.
var ELEM_WAIT = 200;

adapter.before();
adapter.beforeEach();

beforeEach(function (done) {
  // **Note**: Could move to `before` if "per suite" (not test) client.
  adapter.client
    // TODO .setImplicitWaitTimeout(ELEM_WAIT)
    .call(done);
});

afterEach(function (done) {
  // **Note**: Not needed for "per test" client configuration.

  // Clear all LS to start from scratch.
  // Note: Should come *after* not before browser window / session begins.
  // See: http://stackoverflow.com/questions/21259235
  adapter.client
    // TODO .clearLocalStorage()
    .call(done);
});

adapter.afterEach();
adapter.after();
