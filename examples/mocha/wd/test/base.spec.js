"use strict";

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
    // Set timeout for waiting on elements.
    .setImplicitWaitTimeout(ELEM_WAIT)

    // Nuke any existing local storage
    .get("http://backbone-testing.com/notes/app/")
    .clearLocalStorage()

    .nodeify(done);
});

adapter.afterEach();
adapter.after();
