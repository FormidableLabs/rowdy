/**
 * Create client.
 */
module.exports = {
  create: function (config) {
    var Client = require("./base");

    return new Client(config);
  }
};
