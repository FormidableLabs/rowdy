"use strict";

/**
 * Simple logger.
 */
// Enable colors.
require("colors");

module.exports = function () {
  /*eslint-disable no-console*/
  console.log.apply(console, arguments);
  /*eslint-enable no-console*/
};
