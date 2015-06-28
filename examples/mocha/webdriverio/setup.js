/**
 * Mocha setup.
 */
var chai = require("chai");
var Adapter = require("../../../index").adapters.mocha;

// Globals.
global.expect = chai.expect;
global.adapter = new Adapter();

// Enable Rowdy with webdriverio.
var _ = require("lodash");
var rowdy = require("../../../index");
var config = require("../../../config");
rowdy(_.extend({}, config, {
  options: {
    driverLib: "webdriverio"
  }
}));
