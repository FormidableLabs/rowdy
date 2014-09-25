/**
 * Simple logger.
 */
// Enable colors.
require("colors");

module.exports = function () {
  console.log.apply(console, arguments);
};
