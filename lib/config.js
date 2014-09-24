/**
 * Simple config wrapper.
 */
// TODO: Merge in `rowdy.json` or `rowdy.js` or call in main module?

// Sauce
var SAUCE_BRANCH = process.env.TRAVIS_BRANCH || "local";
var SAUCE_TAG = process.env.SAUCE_USERNAME + "@" + SAUCE_BRANCH;

// Sauce
var BROWSER_STACK_BRANCH = process.env.TRAVIS_BRANCH || "local";
var BROWSER_STACK_TAG = process.env.BROWSER_STACK_USERNAME + "@" +
  BROWSER_STACK_BRANCH;

var config = module.exports = {
  /**
   * `SEL_BROWSER_NAME`: `desiredCapabilities.browserName`
   *
   * Options:
   * - "firefox",
   * - "phantomjs"
   * - "chrome"
   * - "safari"
   *
   * See: https://code.google.com/p/selenium/wiki/DesiredCapabilities
   */
  SEL_BROWSER_NAME: process.env.SEL_BROWSER_NAME || "firefox",

  /**
   * Log selenium output?
   *
   * TODO: Abstract to more full-fledged logger.
   */
  SEL_LOGGER: process.env.SEL_LOGGER === true ||
    process.env.SEL_LOGGER === "true",

  /**
   * SauceLabs configs.
   */
  SAUCE: {
    "chrome-win7": {
      // TODO: Extract to base config.
      // https://saucelabs.com/platforms
      desiredCapabilities: {
        browserName: "chrome",
        platform: "Windows 7",
        tags: [SAUCE_TAG],
        name: "Functional Tests"
      },
      host: "ondemand.saucelabs.com",
      port: 80,
      user: process.env.SAUCE_USERNAME,
      key: process.env.SAUCE_ACCESS_KEY,
      logLevel: "silent" // TODO: REMOVE?
    }
  },

  /**
   * Using sauce labs.
   */
  IS_SAUCE: !!process.env.SAUCE,

  /**
   * SauceLabs configs.
   */
  BROWSER_STACK: {
    /*jshint camelcase:false*/
    "chrome-win7": {
      // TODO: Extract to base config.
      // http://www.browserstack.com/automate/capabilities
      desiredCapabilities: {
        browserName: "chrome",
        os: "WINDOWS",
        os_level: "7",
        name: BROWSER_STACK_TAG,
        project: "Functional Tests"
      },
      host: "hub.browserstack.com",
      port: 80,
      user: process.env.BROWSER_STACK_USERNAME,
      key: process.env.BROWSER_STACK_ACCESS_KEY
    }
    /*jshint camelcase:true*/
  },

  /**
   * Using sauce labs.
   */
  IS_BROWSER_STACK: !!process.env.BROWSER_STACK,

  /**
   * Assemble configurations.
   */
  get: function () {
    // Remote vendors.
    if (config.IS_SAUCE) {
      return config.SAUCE[process.env.SAUCE];
    } else if (config.IS_BROWSER_STACK) {
      return config.BROWSER_STACK[process.env.BROWSER_STACK];
    }

    // Local.
    return {
      desiredCapabilities: {
        browserName: config.SEL_BROWSER_NAME
      }
    };
  }
};
