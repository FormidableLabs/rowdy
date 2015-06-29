/**
 * Create client.
 */
module.exports = {
  create: function (config) {
    // Decide driver library.
    var implLib = config.options.driverLib;
    var Client = require("./impl/" + implLib);

    return new Client(config);
  }
};
