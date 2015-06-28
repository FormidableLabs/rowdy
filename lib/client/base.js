/**
 * Abstract base client (browser) wrapper.
 */
var log = require("../log");

/**
 * Client.
 *
 * @param {Object} config Configuration object.
 */
var Client = module.exports = function (config) {
  // Validation.
  if (!this._selClient) {
    throw new Error("Must initialize real selenium client object");
  }

  // Init member variables, stash config.
  this._config = config;

  // Set up extra logging.
  if (config.options.clientLogger) {
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
 */
Client.prototype._addLogger = function () {};

/**
 * Initialize underlying client with capabilities.
 */
Client.prototype.init = function (/*caps, callback*/) {
  throw new Error("Must implement");
};

/**
 * Quit underlying client.
 */
Client.prototype.quit = function (/*callback*/) {
  throw new Error("Must implement");
};

/**
 * Upload sauce labs "passed" status.
 */
Client.prototype.updateSauceStatus = function (/*passed, callback*/) {
  throw new Error("Must implement");
};
