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
   * Manage Mocha `done` callback with error or success termination.
   *
   * This wrapper is useful to ensure that `done` is called exactly once.
   * Under the hood relies on the following calls:
   * - `catch()`
   * - `call()`
   *
   * Usage:
   *
   * ```js
   *  adapter.client
   *    .url(global.TEST_FUNC_BASE_URL)
   *    // Use `.then()` and just ignore errors until final catch.
   *    .getText(".e2e-input").then(function (text) {
   *      expect(text).to.equal("");
   *    })
   *
   *    // Returns a function that will catch and terminate the promise chain.
   *    .finally(promiseDone(done));
   * ```
   *
   * @param   {Function} done Mocha callback
   * @returns {Function}      Callback with promise termination
   */
  promiseDone: function (done) {
    return function () {
      // `this` is the promise.
      /*eslint-disable no-invalid-this*/
      var self = this;
      /*eslint-enable no-invalid-this*/

      // Ensure only called _once_ and first with _error_ if any.
      var called = false;
      var wrapped = function (err) {
        if (called) { return; }
        called = true;
        done(err);
      };

      return self
        .catch(function (err) {
          if (err) { return wrapped(err); }
        })
        .call(wrapped);
    };
  }
};
