"use strict";

/**
 * Rowdy.
 */
var config = require("./lib/config");
var Server = require("./lib/server");
var clientWrapper = require("./lib/client");

// Stashed, singleton configuration.
var _config;

var rowdy = module.exports = function (cfg) {
  _config = config(cfg);
  return rowdy;
};

/**
 * rowdy.config
 *
 * Overall configuration object.
 */
Object.defineProperty(rowdy, "config", {
  get: function () {
    // Lazy initialization.
    if (!_config) {
      rowdy(require("./config")); // eslint-disable-line global-require
    }

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
    return rowdy.config.setting;
  }
});

/**
 * rowdy.setupServer()
 *
 * Set up new Selenium server and other state.
 *
 * @param {Function} callback Callback `fn(err, server)` when started
 * @returns {void}
 */
rowdy.setupServer = function (callback) {
  var server = new Server(rowdy.config);

  // Start selenium and wait until ready.
  if ((rowdy.setting.server || {}).start) {
    return server.start(function (err) {
      if (err) { Server.log("[error]".red, err.toString().trim()); }
      callback(err, server);
    });
  }

  callback(null, server);
};

/**
 * rowdy.setupClient()
 *
 * Set up a new WD client and other state.
 *
 * @param {Function} callback Callback `fn(err, client)` when started
 * @returns {void}
 */
rowdy.setupClient = function (callback) {
  var client = clientWrapper.create(rowdy.config);

  client.init(null, function (err) {
    if (err) { client.log("[error]".red, err.toString().trim()); }
    callback(err, client);
  });
};

/**
 * rowdy.teardownClient()
 *
 * Tear down Selenium server and other state.
 *
 * @param {Object} server Server object
 * @param {Function} callback Callback `fn(err)` when stopped
 * @returns {void}
 */
rowdy.teardownServer = function (server, callback) {
  if ((rowdy.setting.server || {}).start) {
    return server.stop(callback);
  }

  callback();
};

/**
 * rowdy.teardownClient()
 *
 * Tear down WD client and other state.
 *
 * @param {Object} client Client object
 * @param {Function} callback Callback `fn(err)` when stopped
 * @returns {void}
 */
rowdy.teardownClient = function (client, callback) {
  client.quit(callback);
};

/**
 * Adapters.
 */
rowdy.adapters = {
  mocha: require("./adapters/mocha") // eslint-disable-line global-require
};

/**
 * Helpers.
 */
rowdy.helpers = {
  /*eslint-disable global-require*/
  js: require("./helpers/js"),
  webdriverio: require("./helpers/webdriverio")
  /*eslint-enable global-require*/
};

