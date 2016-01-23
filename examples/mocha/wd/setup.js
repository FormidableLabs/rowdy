"use strict";

/**
 * Mocha setup.
 */
var chai = require("chai");
var Adapter = require("../../../index").adapters.mocha;

// Globals.
global.expect = chai.expect;
global.adapter = new Adapter();
