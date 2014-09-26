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
    return client(rowdy.config, rowdy.setting);
  }
});

/**
 * rowdy.config
 *
 * Overall configuration object.
 */
Object.defineProperty(rowdy, "config", {
  get: function () {
    if (!_config) { throw new Error("Must configure Rowdy first!"); }

    return _config;
  }
});

/**
 * rowdy.config
 *
 * Configuration with Selenium `desiredCapabilities` and WD `remote`
 * initialization options.
 */
Object.defineProperty(rowdy, "setting", {
  get: function () {
    return rowdy.config._setting;
  }
});

/**
 * rowdy.setupServer()
 *
 * Set up Selenium server and other state.
 */
rowdy.setupServer = function (callback) {
  // Start selenium and wait until ready.
  if (rowdy.config._setting.startLocal) {
    selenium.start();
    return selenium.ready(callback);
  }

  callback();
};

/**
 * rowdy.setupClient()
 *
 * Set up WD client and other state.
 */
rowdy.setupClient = function (callback) {
  var caps = rowdy.config._setting.desiredCapabilities;

  rowdy.client
    .init(caps)
    .nodeify(callback);
};

/**
 * rowdy.teardownClient()
 *
 * Tear down Selenium server and other state.
 */
rowdy.teardownServer = function (callback) {
  if (rowdy.config._setting.startLocal) {
    selenium.kill();
  }

  callback();
};

/**
 * rowdy.teardownClient()
 *
 * Tear down WD client and other state.
 */
rowdy.teardownClient = function (callback) {
  rowdy.client
    .quit()
    .nodeify(callback);
};

/**
 * Adapters.
 */
rowdy.adapters = {
  mocha: require("./adapters/mocha")
};

