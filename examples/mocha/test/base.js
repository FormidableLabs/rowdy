/**
 * Global setup / teardown.
 */
var adapter = require("../../../index").adapters.mocha;

var server = global.serverAdapter = new adapter.Server();
var client = global.clientAdapter = new adapter.Client();

// Globals
var ELEM_WAIT = 200;

server.before();
client.before();

server.beforeEach();
client.beforeEach();

// Set our custom
before(function (done) {
  global.clientAdapter.client
    // Global wait.
    .setImplicitWaitTimeout(ELEM_WAIT)

    // Get the page a first time so that we can set LS.
    .get("http://backbone-testing.com/notes/app/")
    .clearLocalStorage()

    .nodeify(done);
});

client.afterEach();
server.afterEach();

afterEach(function (done) {
  // Clear all LS to start from scratch.
  // Note: Should come *after* not before browser window / session begins.
  // See: http://stackoverflow.com/questions/21259235
  global.clientAdapter.client
    .clearLocalStorage()
    .nodeify(done);
});

client.after();
server.after();
