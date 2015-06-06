/**
 * Base (noop) adapter.
 *
 * @param {Object} adapterCfg   Specific configurations for adapter.
 */
var Base = module.exports = function (adapterCfg) {
  // Adapter configuration.
  this.adapterCfg = adapterCfg || {};

  // Proxy the (lazy) rowdy configuration.
  Object.defineProperty(this, "config", {
    get: function () {
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
