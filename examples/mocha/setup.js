/**
 * Mocha setup.
 */
/*globals chai:true */
var chai = require("chai");
var sel = require("../../lib/selenium");

// Add test lib globals, and patch Chai.
global.expect = chai.expect;

// Set test environment
process.env.NODE_ENV = "test";

// Start selenium server.
sel.start();
