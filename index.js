/**
 * Rowdy.
 */
var config = require("./lib/config");
var client = require("./lib/client");
var selenium = require("./lib/selenium");

// Stashed configuration.
var _config;

var rowdy = module.exports = function (cfg) {
  _config = config(cfg);
};

Object.defineProperty(rowdy, "client", {
  get: function () {
    if (!_config) { throw new Error("Must configure Rowdy first!"); }

    return client(_config);
  }
});

Object.defineProperty(rowdy, "config", {
  get: function () {
    if (!_config) { throw new Error("Must configure Rowdy first!"); }

    return _config._setting;
  }
});

Object.defineProperty(rowdy, "server", {
  value: selenium
});
