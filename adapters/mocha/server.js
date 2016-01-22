"use strict";
/*globals before:false, after:false*/

var Base = require("./base");
var inherits = require("util").inherits;

/**
 * Server adapter.
 *
 * @param {Object} adapterCfg   Specific configurations for adapter.
 * @returns {void}
 */
var Server = module.exports = function () {
  Base.apply(this, arguments);
  this.server = null;
};

inherits(Server, Base);

Server.prototype.before = function () {
  var rowdy = require("../../index"); // eslint-disable-line global-require
  var self = this;

  before(function (done) {
    // Check if actually using server.
    if (!(self.config.setting.server || {}).start) {
      return done();
    }

    rowdy.setupServer(function (err, server) {
      if (err) { return done(err); }
      self.server = server;
      done();
    });
  });
};

Server.prototype.after = function () {
  var rowdy = require("../../index"); // eslint-disable-line global-require
  var self = this;

  after(function (done) {
    if (!self.server) { return done(); }
    rowdy.teardownServer(self.server, done);
  });
};
