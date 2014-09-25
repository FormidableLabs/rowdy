/**
 * Configure Rowdy.
 *
 * Override options with:
 * ```
 * ROWDY_OPTIONS='{ startLogger: true }'
 * ```
 *
 * Hook to a configuration with:
 * ```
 * ROWDY_SETTINGS="local.chrome"
 * ```
 */
var _ = require("lodash");

var ROWDY_SETTINGS = process.env.ROWDY_SETTINGS || "default";
var ROWDY_OPTIONS = process.env.ROWDY_OPTIONS || "{}";

/**
 * Global default: local phantomjs.
 *
 * Note: Only if *no* default top-level setting specified.
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

  // Merge options.
  try {
    _.merge(cfg.options, JSON.parse(ROWDY_OPTIONS));
  } catch (err) {
    console.error("Unable to parse ROWDY_OPTIONS", err.stack);
    throw err;
  }

  // Apply default setting if not set.
  if (!cfg.settings.default) {
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

  // Finally, choose desired configuration.
  var settingsPath = ROWDY_SETTINGS.split(".");
  cfg._setting = _.reduce(settingsPath, function (memo, key) {
    if (!_.has(memo, key)) {
      throw new Error("Bad ROWDY_SETTINGS path: " + key);
    }

    return memo[key];
  }, cfg.settings)

  return cfg;
};
