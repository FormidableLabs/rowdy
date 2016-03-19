"use strict";

/**
 * A base configuration.
 *
 * This file will automatically be loaded by rowdy if used without calling
 * `require("rowdy")(config)`.
 *
 * **Default**: Do nothing and allow rowdy to auto-configure with this file.
 *
 * **Import & Override**: You can import this file like:
 *
 * ```js
 * var config = require("rowdy/config");
 * var config.client.logger = true;
 * // OTHER MUTATIONS
 * var rowdy = require("rowdy")(config);
 * ```
 *
 * **Copy & Edit**: Or just copy this file to your own project and edit directly
 * then import.
 *
 */

var path = require("path");

// Infer Phantom path off NPM module if available.
var PHANTOM_PATH = false;
try {
  // Attempt modern phantom first.
  PHANTOM_PATH = require("phantomjs-prebuilt").path; // eslint-disable-line global-require
} catch (err) { /* Swallow */ }
try {
  // Fallback to pre-2 phantom.
  PHANTOM_PATH = PHANTOM_PATH || require("phantomjs").path; // eslint-disable-line global-require
} catch (err) { /* Swallow */ }

// Travis
var BUILD = process.env.TRAVIS_BUILD_NUMBER ?
  process.env.TRAVIS_BUILD_NUMBER + "@" + process.env.TRAVIS_COMMIT :
  "local";

// Sauce
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;
var SAUCE_NAME = process.env.SAUCE_USERNAME;

// Browser Stack
var BROWSER_STACK_BRANCH = process.env.TRAVIS_BRANCH || "local";
var BROWSER_STACK_TAG = process.env.BROWSER_STACK_USERNAME + "@" +
  BROWSER_STACK_BRANCH;
var BROWSER_STACK_NAME = process.env.BROWSER_STACK_USERNAME;

// Default start/stop timeout value.
var TIMEOUT = 10 * 1000; // eslint-disable-line no-magic-numbers

module.exports = {
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

      // Implied Overrides
      // -----------------
      // start: true,
      // phantomPath: PHANTOM_PATH
    },
    guacamole: {
      // Use https://github.com/testarmada/guacamole settings?
      // Note: Implicitly disabled if `guacmole` is not installed.
      enabled: true,
      shrinkwrap: path.join(__dirname, "guacamole-shrinkwrap.json")
    },
    driverLib: "wd" // "wd" or "webdriverio"
  },

  /**
   * Webdriver settings and capabilities.
   *
   * Select a path within this object using `ROWDY_SETTINGS="path.to.foo"`
   * Which will then infer all of the `default` settings at that level
   * and merge with specific fields.
   */
  settings: {
    /**
     * Local Selenium: `desiredCapabilities.browserName`
     *
     * Options:
     * - "firefox",
     * - "phantomjs"
     * - "chrome"
     * - "safari"
     * - "internet explorer"
     *
     * See: https://code.google.com/p/selenium/wiki/DesiredCapabilities
     */
    local: {
      default: {
        desiredCapabilities: {
          browserName: "phantomjs"
        },
        // These options _can_ be overriden from environment options.
        server: {
          start: true,
          phantomPath: PHANTOM_PATH
        }
      },
      phantomjs: {
        desiredCapabilities: {
          browserName: "phantomjs"
        }
      },
      firefox: {
        desiredCapabilities: {
          browserName: "firefox"
        }
      },
      chrome: {
        desiredCapabilities: {
          browserName: "chrome"
        }
      },
      safari: {
        desiredCapabilities: {
          browserName: "safari"
        }
      },
      ie: {
        desiredCapabilities: {
          browserName: "internet explorer"
        }
      }
    },

    /**
     * SauceLabs.
     *
     * https://saucelabs.com/platforms
     */
    sauceLabs: {
      default: {
        desiredCapabilities: {
          name: SAUCE_NAME,
          tags: [SAUCE_TAG],
          public: "public",
          build: BUILD
        },
        remote: {
          port: 80,
          user: process.env.SAUCE_USERNAME,

          // WD.js credentials.
          hostname: "ondemand.saucelabs.com",
          pwd: process.env.SAUCE_ACCESS_KEY,

          // WebdriverIO credentials.
          host: "ondemand.saucelabs.com",
          key: process.env.SAUCE_ACCESS_KEY
        },
        // Custom indicator of vendor service.
        isSauceLabs: true
      }
    },

    /**
     * BrowserStack.
     *
     * http://www.browserstack.com/automate/capabilities
     */
    browserStack: {
      default: {
        desiredCapabilities: {
          name: BROWSER_STACK_TAG,
          project: BROWSER_STACK_NAME,
          build: BUILD
        },
        remote: {
          port: 80,
          user: process.env.BROWSER_STACK_USERNAME,

          // WD.js credentials.
          hostname: "hub.browserstack.com",
          pwd: process.env.BROWSER_STACK_ACCESS_KEY,

          // WebdriverIO credentials.
          host: "hub.browserstack.com",
          key: process.env.BROWSER_STACK_ACCESS_KEY
        },
        // Custom indicator of vendor service.
        isBrowserStack: true
      },
      /*eslint-disable camelcase*/
      "safari-mac": {
        desiredCapabilities: {
          browserName: "safari",
          os: "OS X",
          os_version: "Mavericks"
        }
      },
      "chrome-win7": {
        desiredCapabilities: {
          browserName: "chrome",
          os: "WINDOWS",
          os_version: "7"
        }
      }
      /*eslint-enable camelcase*/
    }
  }
};
