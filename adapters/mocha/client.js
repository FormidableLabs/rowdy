/**
 * Client adapter.
 */
/*globals before:false, afterEach:false, after:false */
var inherits = require("util").inherits;
var Base = require("./base");

var Client = module.exports = function () {
  Base.apply(this, arguments);
  this._client = null;
  this._attempted = 0;
  this._passed = 0;
  this._finished = 0;
};

inherits(Client, Base);

Object.defineProperty(Client.prototype, "client", {
  get: function () {
    if (!this._client) { throw new Error("Client is unset"); }
    return this._client;
  }
});

Client.prototype.before = function () {
  var self = this;

  before(function (done) {
    self.rowdy.setupClient(function (err, client) {
      if (err) { return done(err); }
      self._client = client;
      done();
    });
  });
};

Client.prototype.beforeEach = function () {
  var self = this;

  beforeEach(function () {
    self._attempted++;
  });
};

Client.prototype.afterEach = function () {
  var self = this;

  afterEach(function () {
    self._passed += this.currentTest.state === "passed" ? 1 : 0;
    self._finished++;
  });
};

Client.prototype.after = function () {
  var self = this;

  // Handle SauceLabs accumulation.
  after(function (done) {
    var passed = self._attempted === self._passed &&
      self._attempted === self._finished;

    if (self._client && self.config.setting.isSauceLabs) {
      return self._client
        .sauceJobStatus(passed)
        .nodeify(done);
    }

    // Default.
    done();
  });

  // Teardown client.
  after(function (done) {
    if (!self._client) { return done(); }
    self.rowdy.teardownClient(self._client, done);
  });
};
