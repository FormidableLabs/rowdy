"use strict";

/**
 * Abstract base client (browser) wrapper.
 */
var _ = require("lodash");
var log = require("../log");

/**
 * Client.
 *
 * @param {Object} config Configuration object.
 * @returns {void}
 */
var Client = module.exports = function (config) {
  // Validation.
  if (!this._selClient) {
    throw new Error("Must initialize real selenium client object");
  }

  // Init member variables, stash config.
  this._config = config;

  // Add in client logger.
  if (config.options.client.logger) {
    this._addLogger();
  }
};

Object.defineProperty(Client.prototype, "selClient", {
  /**
   * Return Selenium client.
   *
   * @returns {Object} Underlying Selenium client instance.
   */
  get: function () {
    if (!this._selClient) { throw new Error("Selenium client is unset"); }
    return this._selClient;
  }
});

// Instance props.
Client.prototype.log = log.bind(log, "[CLIENT]".green);

/**
 * Add a logger to stdout.
 *
 * @returns {void}
 */
Client.prototype._addLogger = function () {};

/**
 * Return `remote` object for selenium session.
 *
 * Order of precedence:
 * - Explicit `remote: { port: 1234 }`
 * - `options: { client: { port: 1234 } }`
 * - `options: { server: { port: 1234 } }` if local server is running.
 *
 * @param   {Object} config Configuration object
 * @returns {Object}        Remove object
 */
Client.prototype._getRemote = function (config) {
  var remote = _.cloneDeep(config.setting.remote || {});

  // An explicit `remote` object wins.
  // Otherwise, override with `client` option.
  if (!remote.port && config.options.client.port) {
    remote.port = config.options.client.port;
  }
  // Otherwise, fallback to `server` option if running server.
  if (!remote.port && config.setting.server.start &&
      config.options.server.port) {
    remote.port = config.options.server.port;
  }

  return remote;
};

/**
 * Initialize underlying client with capabilities.
 *
 * @returns {void}
 */
Client.prototype.init = function (/*caps, callback*/) {
  throw new Error("Must implement");
};

/**
 * Quit underlying client.
 *
 * @returns {void}
 */
Client.prototype.quit = function (/*callback*/) {
  throw new Error("Must implement");
};

/**
 * Upload sauce labs "passed" status.
 *
 * @returns {void}
 */
Client.prototype.updateSauceStatus = function (/*passed, callback*/) {
  throw new Error("Must implement");
};
