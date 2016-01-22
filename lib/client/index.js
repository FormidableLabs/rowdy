"use strict";

/**
 * Create client.
 */
module.exports = {
  create: function (config) {
    // Decide driver library.
    var implLib = config.options.driverLib;
    var Client = require("./impl/" + implLib); // eslint-disable-line global-require

    return new Client(config);
  }
};
