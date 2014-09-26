/**
 * Mocha setup.
 */
/*globals chai:true */
var chai = require("chai");

// Globals.
global.expect = chai.expect;

// Configure Rowdy.
var rowdy = require("../../index");
var config = require("./config");
rowdy(config);
