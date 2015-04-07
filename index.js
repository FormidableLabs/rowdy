/**
 * Rowdy.
 */
var config = require("./lib/config");
var Client = require("./lib/client");
var Server = require("./lib/server");

// Stashed, singleton configuration.
var _config;

var rowdy = module.exports = function (cfg) {
  _config = config(cfg);
};

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
 * Set up new Selenium server and other state.
 */
rowdy.setupServer = function (callback) {
  var server = new Server(rowdy.config);

  // Start selenium and wait until ready.
  if (rowdy.setting.startLocal) {
    return server.start(function (err) {
      callback(err, server);
    });
  }

  callback(server);
};

/**
 * rowdy.setupClient()
 *
 * Set up a new WD client and other state.
 */
rowdy.setupClient = function (callback) {
  var client = (new Client(rowdy.config, rowdy.setting)).client;
  var caps = rowdy.setting.desiredCapabilities;

  client
    .init(caps)
    .nodeify(function (err) {
      callback(err, client);
    });
};

/**
 * rowdy.teardownClient()
 *
 * Tear down Selenium server and other state.
 */
rowdy.teardownServer = function (server, callback) {
  if (rowdy.setting.startLocal) {
    return server.stop(callback);
  }

  callback();
};

/**
 * rowdy.teardownClient()
 *
 * Tear down WD client and other state.
 */
rowdy.teardownClient = function (client, callback) {
  client
    .quit()
    .nodeify(callback);
};

/**
 * Adapters.
 */
rowdy.adapters = {
  mocha: require("./adapters/mocha")
};

