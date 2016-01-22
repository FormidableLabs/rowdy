"use strict";

/**
 * Global setup / teardown.
 */
var promiseDone = require("../../../../index").helpers.webdriverio.promiseDone;
var adapter = global.adapter;

// Global wait.
var ELEM_WAIT = 200;

adapter.before();
adapter.beforeEach();

beforeEach(function (done) {
  // **Note**: Could move to `before` if "per suite" (not test) client.
  adapter.client
    // Set timeout for waiting on elements.
    .timeoutsImplicitWait(ELEM_WAIT)

    // Nuke any existing local storage (manually with JS b/c PhantomJS errors
    // for native `.localStorage("DELETE")` call).
    .url("http://backbone-testing.com/notes/app/")
    .execute(function () {
      /*globals window:false*/
      if (window.localStorage) { window.localStorage.clear(); }
    })

    .finally(promiseDone(done));
});

adapter.afterEach();
adapter.after();
