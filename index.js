/**
 * Rowdio.
 */
var config = require("./lib/config");
var Client = require("./lib/client");
var Server = require("./lib/server");

// Stashed, singleton configuration.
var _config;

var rowdio = module.exports = function (cfg) {
  _config = config(cfg);
  return rowdio;
};

/**
 * rowdio.config
 *
 * Overall configuration object.
 */
Object.defineProperty(rowdio, "config", {
  get: function () {
    // Lazy initialization.
    if (!_config) {
      rowdio(require("./config"));
    }

    return _config;
  }
});

/**
 * rowdio.config
 *
 * Configuration with Selenium `desiredCapabilities` and WD `remote`
 * initialization options.
 */
Object.defineProperty(rowdio, "setting", {
  get: function () {
    return rowdio.config.setting;
  }
});

/**
 * rowdio.setupServer()
 *
 * Set up new Selenium server and other state.
 */
rowdio.setupServer = function (callback) {
  var server = new Server(rowdio.config);

  // Start selenium and wait until ready.
  if ((rowdio.setting.server || {}).start) {
    return server.start(function (err) {
      if (err) { Server.LOG("[error]".red, err.toString().trim()); }
      callback(err, server);
    });
  }

  callback(null, server);
};

/**
 * rowdio.setupClient()
 *
 * Set up a new WD client and other state.
 */
rowdio.setupClient = function (callback) {
  var client = (new Client(rowdio.config, rowdio.setting)).client;
  var caps = rowdio.setting.desiredCapabilities;

  client
    .init(caps)
    .call(function (err) {
      if (err) { Client.LOG("[error]".red, err.toString().trim()); }
      callback(err, client);
    });
};

/**
 * rowdio.teardownClient()
 *
 * Tear down Selenium server and other state.
 */
rowdio.teardownServer = function (server, callback) {
  if ((rowdio.setting.server || {}).start) {
    return server.stop(callback);
  }

  callback();
};

/**
 * rowdio.teardownClient()
 *
 * Tear down WD client and other state.
 */
rowdio.teardownClient = function (client, callback) {
  client.end(callback);
};

/**
 * Adapters.
 */
rowdio.adapters = {
  mocha: require("./adapters/mocha")
};
