/**
 * Global setup / teardown.
 */
// Configure Rowdy, then access the client.
var rowdy = require("../../../index");
var config = require("../config");
rowdy(config);

var client = rowdy.client;
var adapter = rowdy.adapters.mocha;

// Globals
var ELEM_WAIT = 200;

adapter.before();
before(function (done) {
  client
    .setImplicitWaitTimeout(ELEM_WAIT)
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

