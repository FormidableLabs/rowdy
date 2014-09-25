/**
 * Configure Rowdy.
 */
var _ = require("lodash");

/**
 * Global default: local phantomjs.
 *
 * Note: Only if *no other* settings specified.
 */
var DEFAULT_SETTING = {
  desiredCapabilities: {
    browserName: "phantomjs",
  },
  startLocal: true
};

var DEFAULTS = {
  /**
   * Misc. options.
   *
   * Options can be globally overriden with a merge of a stringified JSON
   * object like:
   * ```
   * ROWDY_OPTIONS='{ startLogger: true }'
   * ```
   */
  options: {
    startLogger: false
  },

  settings: {}
};

module.exports = function (cfg) {
  // Merge config.
  cfg = _.cloneDeep(_.merge({}, DEFAULTS, cfg));

  // Apply default setting if no settings whatsoever.
  if (_.isEmpty(cfg.settings)) {
    cfg.settings.default = DEFAULT_SETTING
  }

  // Then, apply merge settings defaults to other objects one level down.
  _.each(cfg.settings, function (objs, objsKey) {
    if (objsKey === "defaults" && !objs.default) { return; }
    _.each(objs, function (obj, objKey) {
      if (objKey === "defaults") { return; }
      // Merge defaults
      _.merge(obj, objs.default);
    });
  });

  return cfg;
};
