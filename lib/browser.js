/**
 * Browser wrapper.
 *
 * **Note**: Needs selenium server already running.
 */
var wd = require("wd");
var config = require("./config");
var clientCfg = config.get();
var _client;

require("colors");

var browser = module.exports = {
  /**
   * Add a logger to stdout.
   */
  addLogger: function (client) {
    client.on("status", function(info) {
      // Strip info.
      info = info.replace(/^\s+|\s+$/g, "");
      console.log("[status] " + info.cyan);
    });
    client.on("command", function(eventType, command, response) {
      console.log("[cmd] " + eventType.cyan, command, (response || "").grey);
    });
    client.on("http", function(meth, path, data) {
      console.log("[http] " + meth.magenta, path, (data || "").grey);
    });
  },

  /**
   * Get a new browser client and initialize.
   */
  getClient: function () {
    if (_client) { return _client; }

    _client = config.IS_SAUCE || config.IS_BROWSER_STACK ?
      wd.promiseChainRemote(
        clientCfg.host, clientCfg.port, clientCfg.user, clientCfg.key) :
      wd.promiseChainRemote();

    // Set up extra logging.
    if (config.SEL_LOGGER) {
      browser.addLogger(_client);
    }

    return _client;
  }
};
