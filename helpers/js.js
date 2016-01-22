"use strict";

/**
 * Helpers: JavaScript.
 *
 * Methods to help with JavaScript action on the page under test.
 *
 * - `fn(JAVASCRIPT_FUNCTION)`: Convert a real JavaScript client-side function
 *   for use in Selenium which returns result back into Selenium-land.
 */
module.exports = {
  /**
   * Convert real JavaScript function to string for use in JS conditions.
   *
   * ## Example
   * ```js
   * .waitFor(asserters.jsCondition(helpers.js.fn(function () {
   *   return $(".notes-item .note-delete").length === 0;
   * })))
   * ```
   *
   * @param   {Function} fn Function to stringify
   * @returns {String}      Stringified, IIFE-wrapped function
   */
  fn: function (fn) {
    return "(" + fn.toString() + "())";
  }
};
