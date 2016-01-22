"use strict";

/**
 * Configure Rowdy.
 *
 * Override options with:
 * ```
 * ROWDY_OPTIONS='{ "client":{ "logger":true } }'
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
 *   // WD.js/WebdriverIO remote parameters.
 *   // https://github.com/admc/wd#named-parameters
 *   // https://github.com/webdriverio/webdriverio/blob/master/examples/
 *   //         webdriverio.browserstack.js
 *   //         webdriverio.saucelabs.js
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
var path = require("path");
var _ = require("lodash");

var ROWDY_SETTINGS = process.env.ROWDY_SETTINGS || "";
var ROWDY_OPTIONS = process.env.ROWDY_OPTIONS || "{}";
var SAUCE_CONNECT_TUNNEL_ID = process.env.SAUCE_CONNECT_TUNNEL_ID;
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

// Default start/stop timeout value.
var TIMEOUT = 10 * 1000; // eslint-disable-line no-magic-numbers

var DEFAULTS = {
  /**
   * Misc. options.
   *
   * Options can be globally overriden with a merge of a stringified JSON
   * object like:
   * ```
   * ROWDY_OPTIONS='{ "client":{ "logger":true }, "server":{ "logger":true } }'
   * ROWDY_OPTIONS='{ "driverLib": "wd" }'
   * ROWDY_OPTIONS='{ "driverLib": "webdriverio" }'
   * ```
   */
  options: {
    client: {
      logger: false,
      port: null                // Selenium port to hit.
    },
    server: {
      logger: false,
      debug: false,
      port: null,               // Selenium port to start on.
      useExisting: false,       // Use existing Selenium server?
      startTimeout: TIMEOUT,    // Max wait for local server to start (ms).
      stopTimeout: TIMEOUT      // Max wait for local server to stop (ms).
    },
    guacamole: {
      // Use https://github.com/testarmada/guacamole settings?
      // Note: Implicitly disabled if `guacmole` is not installed.
      enabled: true,
      shrinkwrap: path.join(__dirname, "guacamole-shrinkwrap.json")
    },
    driverLib: DRIVER_LIBS.WD // `wd` or `webdriverio`
  },

  settings: {}
};

// Lazy require Guacamole, returning `null` if not available.
var getGuacamole = _.memoize(function () {
  try {
    return require("guacamole"); // eslint-disable-line global-require
  } catch (err) {
    return null;
  }
});

// TODO: Refactor and decompose out the `max-statements`, `complexity` warnings.
// https://github.com/FormidableLabs/rowdy/issues/29
/*eslint-disable max-statements,complexity*/
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
  // Settings: Extract current desired setting path
  // --------------------------------------------------------------------------
  var settingsPath = ROWDY_SETTINGS.replace(QUOTES_RE, "").split(".");
  settingsPath = _.chain(settingsPath)
    .map(function (v) { return v.trim(); })
    .filter(_.identity)
    .value();

  // --------------------------------------------------------------------------
  // Browser setting extensions (Guacamole)
  // --------------------------------------------------------------------------
  if (cfg.options.guacamole && cfg.options.guacamole.enabled) {
    var guacamole = getGuacamole();

    // SauceLabs.
    // Require guacamole to be installed to actually add capabilities.
    if (guacamole && settingsPath[0] === "sauceLabs") {
      try {
        // Attempt to use a shrinkwrap. If that fails, sync-fetch from Sauce.
        guacamole.useShrinkwrap(cfg.options.guacamole.shrinkwrap);
      } catch (readErr) {
        try {
          guacamole.useServiceSync();
        } catch (fetchErr) {
          throw new Error("Exhausted attempts to fetch sauce browser info:\n"
            + "Couldn't read local shinkwrap: " + readErr.toString() + "\n"
            + "Couldn't GET remote sauce data: " + fetchErr.toString());
        }
      }

      var browserId = settingsPath[1];
      var matchingCapabilities = guacamole.get({ id: browserId });
      if (matchingCapabilities.length !== 1) {
        throw new Error("Unknown SauceLabs browser id: " + browserId);
      }

      // Ensure base configuration.
      cfg.settings.sauceLabs = cfg.settings.sauceLabs || {};

      // Add capabilities.
      cfg.settings.sauceLabs[browserId] = {
        desiredCapabilities: matchingCapabilities[0]
      };
    }

    // BrowserStack
    // TODO: Add BS support when it lands in guacamole.
    // https://github.com/FormidableLabs/rowdy/issues/26
  }

  // --------------------------------------------------------------------------
  // Tunnel Setup (SauceConnect): Add tunnel settings to all browser configs.
  // --------------------------------------------------------------------------

  if (cfg.settings.sauceLabs && SAUCE_CONNECT_TUNNEL_ID) {
    // Mutate all capabilities with tunnel identifier if present.
    _.each(cfg.settings.sauceLabs, function (obj) {
      obj.desiredCapabilities = obj.desiredCapabilities || {};
      obj.desiredCapabilities.tunnelIdentifier = SAUCE_CONNECT_TUNNEL_ID;
    });
  }

  // --------------------------------------------------------------------------
  // Settings: Available Selenium-ish options.
  // --------------------------------------------------------------------------
  // Ensure default setting.
  cfg.settings.default = cfg.settings.default || GLOBAL_DEFAULT;

  // Then, apply merge settings defaults to other objects one level down.
  _.each(cfg.settings, function (objs, objsKey) {
    if (objsKey === "default" && !objs.default) { return; }
    _.each(objs, function (obj, objKey) {
      if (objKey === "default" || !_.isObject(obj)) { return; }
      // Merge defaults
      objs[objKey] = _.merge({}, objs.default, obj);
    });
  });

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

  // Last overrides from options.
  if (!_.isUndefined(cfg.options.server.start)) {
    cfg.settings.server = cfg.settings.server || {};
    cfg.settings.server.start = cfg.options.server.start;
  }
  if (!_.isUndefined(cfg.options.server.phantomPath)) {
    cfg.settings.server = cfg.settings.server || {};
    cfg.settings.server.phantomPath = cfg.options.server.phantomPath;
  }

  return cfg;
};
/*eslint-enable max-statements,complexity*/
