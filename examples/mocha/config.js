/**
 * Configurations.
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
// Sauce
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;

// Browser Stack
var BROWSER_STACK_BRANCH = process.env.TRAVIS_BRANCH || "local";
var BROWSER_STACK_TAG = process.env.BROWSER_STACK_USERNAME + "@" +
  BROWSER_STACK_BRANCH;

module.exports = {
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
        startLocal: true
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
      safari: {
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
          tags: [SAUCE_TAG],
          name: "Functional Tests"
        },
        host: "ondemand.saucelabs.com",
        port: 80,
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY
      },
      "chrome-win7": {
        desiredCapabilities: {
          browserName: "chrome",
          platform: "Windows 7"
        }
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
          project: "Functional Tests"
        },
        host: "hub.browserstack.com",
        port: 80,
        user: process.env.BROWSER_STACK_USERNAME,
        key: process.env.BROWSER_STACK_ACCESS_KEY
      },
      /*jshint camelcase:false*/
      "chrome-win7": {
        desiredCapabilities: {
          browserName: "chrome",
          os: "WINDOWS",
          os_level: "7"
        },
      }
      /*jshint camelcase:true*/
    },
  }
};
