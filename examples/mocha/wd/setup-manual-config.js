"use strict";

/**
 * Additional configuration -- explicit Rowdy configuration.
 */
var path = require("path");
var _ = require("lodash");
var rowdy = require("../../../index");
var config = require("../../../config");
rowdy(_.extend({}, config, {
  options: {
    driverLib: "wd",
    guacamole: {
      shrinkwrap: path.join(__dirname, "../../../guacamole-shrinkwrap.json")
    }
  }
}));
