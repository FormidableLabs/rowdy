/**
 * Server adapter.
 */
/*globals before:false, afterEach:false, after:false */
var inherits = require("util").inherits;
var Base = require("./base");

var Server = module.exports = function () {
  Base.apply(this, arguments);
  this.server = null;
};

inherits(Server, Base);

Server.prototype.before = function () {
  var rowdy = require("../../index");
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
  var rowdy = require("../../index");
  var self = this;

  after(function (done) {
    if (!self.server) { return done(); }
    rowdy.teardownServer(self.server, done);
  });
};
