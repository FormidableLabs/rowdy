/**
 * Configure Rowdy.
 *
 * Override options with:
 * ```
 * ROWDY_OPTIONS='{ clientLogger: true }'
 * ```
 *
 * Hook to a configuration with:
 * ```
 * ROWDY_SETTINGS="local.chrome"
 * ```
 *
 * Basic configurations for a Browser `settings` entry:
 * ```
 * {
 *   // Selenium Desired Capabilities.
 *   // https://code.google.com/p/selenium/wiki/DesiredCapabilities
 *   desiredCapabilities: {},
 *
 *   // WD.js remote parameters.
 *   // https://github.com/admc/wd#named-parameters
 *   remote: {},
 *
 *   // Uses SauceLabs SAAS.
 *   isSauceLabs: true,
 *
 *   // Uses BrowserStack SAAS.
 *   isBrowserStack: true,
 * }
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
   * ROWDY_OPTIONS='{ "clientLogger": true, "serverLogger": true }'
   * ```
   */
  options: {
    clientLogger: false,
    serverLogger: false,
    serverDebug: false
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
    console.error("Unable to parse ROWDY_OPTIONS: " + err.toString());
    throw err;
  }

  // Apply default setting if not set.
  if (!cfg.settings.default) {
    cfg.settings.default = DEFAULT_SETTING;
  }

  // Then, apply merge settings defaults to other objects one level down.
  _.each(cfg.settings, function (objs, objsKey) {
    if (objsKey === "default" && !objs.default) { return; }
    _.each(objs, function (obj, objKey) {
      if (objKey === "default" || !_.isObject(obj)) { return; }
      // Merge defaults
      objs[objKey] = _.merge({}, objs.default, obj);
    });
  });

  // Finally, choose desired configuration and place on `_setting`.
  var settingsPath = ROWDY_SETTINGS.split(".");
  cfg._setting = _.reduce(settingsPath, function (memo, key) {
    if (!_.has(memo, key)) {
      throw new Error("Bad ROWDY_SETTINGS path: " + ROWDY_SETTINGS);
    }

    return memo[key];
  }, cfg.settings);

  return cfg;
};
