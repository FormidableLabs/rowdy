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
 * Initialize the client with capabilities.
 */
var _initClient = function (callback) {
  return function () {
    var caps = rowdy.config._setting.desiredCapabilities;
    var client = rowdy.client;

    client
      .init(caps)
      .nodeify(callback);
  };
};

/**
 * rowdy.setup()
 *
 * Set up Selenium server and other state.
 */
rowdy.setup = function (callback) {
  var cfg = rowdy.config;

  // Patch callback to finish by calling client initialization.
  callback = callback ? _initClient(callback) : _initClient();

  // Start selenium and wait until ready.
  if (cfg._setting.startLocal) {
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
  var client = rowdy.client;

  // Shutdown the client.
  client.quit().nodeify(function () {
    // Shutdown the server.
    if (cfg._setting.startLocal) {
      selenium.kill();
    }

    callback();
  });
};

/**
 * Adapters.
 */
rowdy.adapters = {
  mocha: require("./adapters/mocha")
};

