/**
 * Rowdy.
 */
var config = require("./lib/config");

module.exports = function (cfg) {
  var _config = config(cfg);
  console.log("_config", JSON.stringify(_config, null, 2));
};
