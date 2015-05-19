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
