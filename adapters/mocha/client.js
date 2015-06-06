var Base = require("./base");
var inherits = require("util").inherits;

/**
 * Client adapter.
 *
 * @param {Object}  adapterCfg          Specific configurations for adapter.
 * @param {Boolean} adapterCfg.perTest  New `client` per *each* test? (`false`)
 */
var Client = module.exports = function () {
  Base.apply(this, arguments);

  // Test configuration perTest or perSuite client?
  var cfg = this.adapterCfg;
  this._perTest = !!(cfg && cfg.client && cfg.client.perTest);
  this._perSuite = !this._perTest;

  // Stash the client reference to pass on.
  this._client = null;

  // Test state.
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

Client.prototype._setupClient = function (done) {
  var rowdy = require("../../index");
  var self = this;

  rowdy.setupClient(function (err, client) {
    if (err) { return done(err); }
    self._client = client;
    done();
  });
};

Client.prototype._teardownClient = function (done) {
  var rowdy = require("../../index");

  if (!this._client) { return done(); }

  rowdy.teardownClient(this._client, done);
};

Client.prototype.before = function () {
  var self = this;

  before(function (done) {
    if (self._perSuite) { return self._setupClient(done); }
    done();
  });
};

Client.prototype.beforeEach = function () {
  var self = this;

  beforeEach(function (done) {
    self._attempted++;

    if (self._perTest) { return self._setupClient(done); }
    done();
  });
};

Client.prototype.afterEach = function () {
  var self = this;

  afterEach(function (done) {
    self._passed += this.currentTest.state === "passed" ? 1 : 0;
    self._finished++;

    if (self._perTest) { return self._teardownClient(done); }
    done();
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

  after(function (done) {
    if (self._perSuite) { return self._teardownClient(done); }
    done();
  });
};
