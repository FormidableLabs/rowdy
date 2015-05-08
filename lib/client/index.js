/**
 * Create client.
 */
module.exports = {
  create: function (config) {
    var Client = require("./impl/wd");

    return new Client(config);
  }
};
