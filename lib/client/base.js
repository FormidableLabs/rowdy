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
  // Set up extra logging.
  if (config.options.clientLogger) {
    this._addLogger();
  }
};

// Instance props.
Client.prototype.log = log.bind(log, "[CLIENT]".green);

/**
 * Add a logger to stdout.
 */
Client.prototype._addLogger = function () {};
