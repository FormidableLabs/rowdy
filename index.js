/**
 * Rowdy.
 */
var config = require("./lib/config");

// Stashed configuration.
var _config;

var rowdy = module.exports = function (cfg) {
  _config = config(cfg);
};

Object.defineProperty(rowdy, "client", {
  get: function () {
    if (!_config) { throw new Error("Must configure Rowdy first!"); }

    // TODO: Make into a client.
    return _config._setting;
  }
});
