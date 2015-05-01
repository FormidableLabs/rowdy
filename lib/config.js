/**
 * Configure Rowdio.
 *
 * Override options with:
 * ```
 * ROWDIO_OPTIONS='{ clientLogger: true }'
 * ```
 *
 * Hook to a configuration with:
 * ```
 * ROWDIO_SETTINGS="local.chrome"
 * ```
 *
 * Basic configurations for a Browser `settings` entry:
 * ```
 * {
 *   // Selenium Desired Capabilities.
 *   // https://code.google.com/p/selenium/wiki/DesiredCapabilities
 *   desiredCapabilities: {},
 *
 *   // WebdriverIO remote parameters.
 *   // https://github.com/webdriverio/webdriverio#options
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

var ROWDIO_SETTINGS = process.env.ROWDIO_SETTINGS || "";
var ROWDIO_OPTIONS = process.env.ROWDIO_OPTIONS || "{}";
var QUOTES_RE = /^[\s\\\'\"]*|[\s\\\'\"]*$/g;

/**
 * Global default: local phantomjs.
 *
 * Note: Only if *no* default top-level setting specified.
 */
var GLOBAL_DEFAULT = {
  desiredCapabilities: {
    browserName: "phantomjs",
  },
  server: {
    start: true,
    phantomPath: false
  }
};

var DEFAULTS = {
  /**
   * Misc. options.
   *
   * Options can be globally overriden with a merge of a stringified JSON
   * object like:
   * ```
   * ROWDIO_OPTIONS='{ "clientLogger": true, "serverLogger": true }'
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
    _.merge(cfg.options, JSON.parse(ROWDIO_OPTIONS.replace(QUOTES_RE, "")));
  } catch (err) {
    console.error("Unable to parse ROWDIO_OPTIONS: " + err.toString());
    throw err;
  }

  // Add default setting if not set.
  if (!cfg.settings.default) {
    cfg.settings.default = GLOBAL_DEFAULT;
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

  // Finally, choose desired configuration and place on `setting`.
  var settingsPath = ROWDIO_SETTINGS.replace(QUOTES_RE, "").split(".");
  settingsPath = _.chain(settingsPath)
    .map(function (v) { return v.trim(); })
    .filter(_.identity)
    .value();

  // If no settings path, _try_ to go for `local.default`, then `default`.
  if (!settingsPath.length) {
    if (cfg.settings.local && cfg.settings.local.default) {
      settingsPath = ["local", "default"];
    } else {
      settingsPath = ["default"];
    }
  }

  cfg.setting = _.reduce(settingsPath, function (memo, key) {
    if (!_.has(memo, key)) {
      throw new Error("Bad ROWDIO_SETTINGS path: " + ROWDIO_SETTINGS);
    }

    return memo[key];
  }, cfg.settings);

  return cfg;
};
