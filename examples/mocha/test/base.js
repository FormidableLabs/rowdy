/**
 * Global setup / teardown.
 */
var adapter = require("../../../index").adapters.mocha;

// Globals
var ELEM_WAIT = 200;

// Client-side helpers
var _clientClearLocalStorage = function () {
  /*globals window:false*/
  // Client side: Clear LS if exists.
  if (window.localStorage) {
    window.localStorage.clear();
  }
};

adapter.before();
before(function (done) {
  adapter.client
    // Global wait.
    .timeoutsImplicitWait(ELEM_WAIT)

    // Get the page a first time so that we can set LS.
    .url("http://backbone-testing.com/notes/app/")
    .execute(_clientClearLocalStorage)

    .call(done);
});

adapter.beforeEach();

adapter.afterEach();
afterEach(function (done) {
  // Clear all LS to start from scratch.
  // Note: Should come *after* not before browser window / session begins.
  // See: http://stackoverflow.com/questions/21259235
  adapter.client
    .execute(_clientClearLocalStorage)
    .call(done);
});

adapter.after();
