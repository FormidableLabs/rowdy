// Overwite adapter with "per test client" version.
var Adapter = require("../../../index").adapters.mocha;
global.adapter = new Adapter(null, {
  options: {
    driverLib: "webdriverio"
  },
  client: {
    perTest: true
  }
});
