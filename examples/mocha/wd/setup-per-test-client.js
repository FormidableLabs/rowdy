"use strict";

// Overwite adapter with "per test client" version.
var Adapter = require("../../../index").adapters.mocha;
global.adapter = new Adapter({
  client: {
    perTest: true
  }
});
