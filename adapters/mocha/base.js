"use strict";

/**
 * Base (noop) adapter.
 *
 * @param {Object} adapterCfg   Specific configurations for adapter.
 * @returns {void}
 */
var Base = module.exports = function (adapterCfg) {
  // Adapter configuration.
  this.adapterCfg = adapterCfg || {};

  // Proxy the (lazy) rowdy configuration.
  Object.defineProperty(this, "config", {
    get: function () {
      /*eslint-disable global-require*/
      return require("../../index").config;
    }
  });
};

Base.prototype = {
  before: function () {},
  beforeEach: function () {},
  afterEach: function () {},
  after: function () {}
};
