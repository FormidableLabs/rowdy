/**
 * Base (noop) adapter.
 */
var wrapCfg = require("../../lib/config");

var Base = module.exports = function (config) {
  this.config = wrapCfg(config || require("../../config"));
};

Base.prototype = {
  before: function () {},
  beforeEach: function () {},
  afterEach: function () {},
  after: function () {}
};

// Expose lazy-required `rowdy` base client (to get around circular deps).
Object.defineProperty(Base.prototype, "rowdy", {
  get: function () {
    return require("../../index");
  }
});
