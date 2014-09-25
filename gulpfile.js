/**
 * Gulp!
 */
var fs = require("fs");
var gulp = require("gulp");
var jshint = require("gulp-jshint");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jsonCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint", function () {
  gulp
    .src([
      "*.js",
      "lib/**/*.js",
      "adapters/**/*.js",
      "examples/**/*.js"
    ])
    .pipe(jshint(_jsonCfg("./_dev/.jshintrc-backend.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check",      ["jshint"]);
gulp.task("default",    ["check"]);
