roWDy
=====

A small, rambuctious configuration wrapper for
[WD.js](https://github.com/admc/wd).

Main features:

* Easy configuration for local, Sauce Labs, Browser Stack testing.
* Invokes selenium server for local runs automagically.
* Integration helpers for Mocha tests.
* Use your own test framework and test runner.

## Usage

First, install the library.

```
$ npm install rowdy
```

Then, create a configuration file. You can see an
[example configuration](./examples/mocha/config.js) in our test examples.

From there, you can instantiate and configure Rowdy for actual operations:

```js
// Configure Rowdy, then access the client.
var rowdy = require("rowdy");
var config = require("./PATH/TO/config");
rowdy(config);
```

## API

*TODO*

### Examples:

* [examples/mocha](./examples/mocha): Basic Mocha/Chai tests using WD promises
  and the [Rowdy Mocha Adapter](./adapters/mocha.js)

## WD Guide

The full API to WD.js is available at:
https://github.com/admc/wd/blob/master/doc/api.md

## Contributions

Please see the [Contributions Guide](./CONTRIBUTING.md) for how to help out
with the plugin.

We test all changes with [Travis CI][trav]. Here's our current
[build status][trav_site]:

[![Build Status][trav_img]][trav_site]

[trav]: https://travis-ci.org/
[trav_img]: https://travis-ci.org/FormidableLabs/rowdy.svg
[trav_site]: https://travis-ci.org/FormidableLabs/rowdy
[trav_cfg]: ./.travis.yml

We also do multi-browser testing thanks to donated VM time from
[Sauce Labs][sauce] and [BrowserStack][bs].
Here's our Sauce Labs [build matrix][sauce_site]:

[![Sauce Test Status][sauce_img]][sauce_site]

[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/rowdy.svg
[sauce_site]: https://saucelabs.com/u/rowdy
[bs]: http://www.browserstack.com/

## Licenses
All code not otherwise specified is Copyright 2014 Formidable Labs, Inc.
Released under the [MIT](./LICENSE.txt) License.
