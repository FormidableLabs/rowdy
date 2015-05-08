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

var ROWDY_SETTINGS = process.env.ROWDY_SETTINGS || "";
var ROWDY_OPTIONS = process.env.ROWDY_OPTIONS || "{}";
var QUOTES_RE = /^[\s\\\'\"]*|[\s\\\'\"]*$/g;

/**
 * Driver libraries.
 *
 * Map enum to `require` statement.
 */
var DRIVER_LIBS = {
  WD: "wd",                   // https://github.com/admc/wd
  WEBDRIVERIO: "webdriverio"  // http://webdriver.io/
};

/**
 * Global default: local phantomjs.
 *
 * Note: Only if *no* default top-level setting specified.
 */
var GLOBAL_DEFAULT = {
  desiredCapabilities: {
    browserName: "phantomjs"
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
   * ROWDY_OPTIONS='{ "clientLogger": true, "serverLogger": true }'
   * ROWDY_OPTIONS='{ "driverLib": "wd" }'
   * ROWDY_OPTIONS='{ "driverLib": "webdriverio" }'
   * ```
   */
  options: {
    clientLogger: false,
    serverLogger: false,
    serverDebug: false,
    driverLib: DRIVER_LIBS.WD // `wd` or `webdriverio`
  },

  settings: {}
};

// TODO: Refactor and decompose out the `max-statements` warning.
/*eslint-disable max-statements*/
module.exports = function (cfg) {
  // Merge config.
  cfg = _.cloneDeep(_.merge({}, DEFAULTS, cfg));

  // --------------------------------------------------------------------------
  // Options: Rowdy configuration.
  // --------------------------------------------------------------------------
  try {
    _.merge(cfg.options, JSON.parse(ROWDY_OPTIONS.replace(QUOTES_RE, "")));
  } catch (err) {
    /*eslint-disable no-console*/
    console.error("Unable to parse ROWDY_OPTIONS: " + err.toString());
    /*eslint-enable no-console*/
    throw err;
  }

  // Validate driver library.
  if (!_.includes(DRIVER_LIBS, cfg.options.driverLib)) {
    throw new Error("Unknown driver library option: " + cfg.options.driverLib);
  }

  // --------------------------------------------------------------------------
  // Settings: Available Selenium-ish options.
  // --------------------------------------------------------------------------
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
  var settingsPath = ROWDY_SETTINGS.replace(QUOTES_RE, "").split(".");
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

  // --------------------------------------------------------------------------
  // Setting: The actual chosen Selenium-ish setting.
  // --------------------------------------------------------------------------
  cfg.setting = _.reduce(settingsPath, function (memo, key) {
    if (!_.has(memo, key)) {
      throw new Error("Bad ROWDY_SETTINGS path: " + ROWDY_SETTINGS);
    }

    return memo[key];
  }, cfg.settings);

  return cfg;
};
/*eslint-enable max-statements*/
