/**
 * Mocha setup.
 */
/*globals chai:true */
var chai = require("chai");

// Configure rowdy.
var config = require("./config");
var rowdy = require("../../index");
rowdy(config);

// Globals.
global.expect = chai.expect;
