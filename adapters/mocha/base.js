var wrapCfg = require("../../lib/config");

/**
 * Base (noop) adapter.
 *
 * @param {Object} config       Rowdy configuration object.
 * @param {Object} adapterCfg   Specific configurations for adapter.
 */
var Base = module.exports = function (config, adapterCfg) {
  this.config = wrapCfg(config || require("../../config"));
  this.adapterCfg = adapterCfg || {};
};

Base.prototype = {
  before: function () {},
  beforeEach: function () {},
  afterEach: function () {},
  after: function () {}
};
