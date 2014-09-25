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

/**
 * rowdy.client
 *
 * A WD.js promise chain browser / client.
 * Still needs `init()` to be called.
 *
 * See: https://github.com/admc/wd#browser-initialization
 */
Object.defineProperty(rowdy, "client", {
  get: function () {
    return client(rowdy.config);
  }
});

/**
 * rowdy.config
 *
 * Configuration with Selenium `desiredCapabilities` and WD `remote`
 * initialization options.
 */
Object.defineProperty(rowdy, "config", {
  get: function () {
    if (!_config) { throw new Error("Must configure Rowdy first!"); }

    return _config;
  }
});

/**
 * rowdy.setup()
 *
 * Set up Selenium server and other state.
 */
rowdy.setup = function (callback) {
  var cfg = rowdy.config;

  if (cfg._setting.startLocal) {
    // Start selenium and wait until ready.
    selenium.start();
    return selenium.ready(callback);
  }

  callback();
};

/**
 * rowdy.teardown()
 *
 * Tear down Selenium server and other state.
 */
rowdy.teardown = function (callback) {
  var cfg = rowdy.config;

  if (cfg._setting.startLocal) {
    // Kill server.
    selenium.kill();
  }

  callback();
};
