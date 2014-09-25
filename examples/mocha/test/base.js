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

// Additional, custom before for further client tweaks.
before(function (done) {
  client
    .setImplicitWaitTimeout(ELEM_WAIT)
    .nodeify(done);
});

adapter.afterEach();
adapter.after();

