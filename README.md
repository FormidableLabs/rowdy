Rowdio
======

A small, rambuctious configuration wrapper for
[WebdriverIO](http://webdriver.io/).

Main features:

* Easy configuration for local, Sauce Labs, Browser Stack testing.
* Invokes selenium server for local runs automagically.
* Use your own test framework and test runner.

Related projects:

* [rowdy](https://github.com/FormidableLabs/rowdy): Wrapper for
  [WD.js](https://github.com/admc/wd).

## TODO

* Remove client logs b/c https://github.com/webdriverio/webdriverio#coloredlogs
* Port over the client
* Verify options are the same
* Get mocha adapter working
* Get mocha tests working
* Try multi-browsers functionality.
* Add new saucelabs sub-account.

## Basic Usage

First, install the library.

```
$ npm install rowdio
```

## Configuration

By default Rowdio will lazy initialize the library's included
[config.js](./config.js) configuration file. (The first access of most
`rowdio.*` properties / methods will force this.)

However, on first import of Rowdio, you can override this behavior to do things
like override parts of the default configuration:

```js
// Start with default configuration.
var config = require("rowdio/config");
config.serverLogger = true;
// ... any other mutations

// Pass configuration in.
var rowdio = require("rowdio")(config);
```

Or, you can simply copy [config.js](./config.js) to your project, edit it
as appropriate and load:

```js
var config = require("./PATH/TO/config");
var rowdio = require("rowdio")(config);
```

## Local Usage

One of the Rowdio peer dependencies is `selenium-standalone`. This package
contains an install script that you may need (and do need on Windows):

```
$ node_modules/.bin/selenium-standalone install
```

Some other tips and tricks:

### Mac + Safari

Recent Safari updates have broken automatic driver usage, so you need a series
of tedious steps per http://elementalselenium.com/tips/69-safari:

* Download the driver at your current version from `https://github.com/SeleniumHQ/selenium/raw/selenium-VERSION/javascript/safari-driver/prebuilt/SafariDriver.safariextz`. A current version used in `selenium-standalone` is `2.45.0`, so
that would correspond to:
[ithub.com/SeleniumHQ/selenium/raw/selenium-2.45.0/javascript/safari-driver/prebuilt/SafariDriver.safariextz](https://github.com/SeleniumHQ/selenium/raw/selenium-2.45.0/javascript/safari-driver/prebuilt/SafariDriver.safariextz)
* Double click the downloaded driver file. Click "Install" when prompted by
  Safari.

### Windows + IE

See https://code.google.com/p/selenium/wiki/InternetExplorerDriver#Required_Configuration
for extra steps needed to work with local IE. Anecdotally, for Win7+IE11 in a
VM, the only actually tweak needed was:

* Create key
  `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Internet Explorer\MAIN\FeatureControl\FEATURE_BFCACHE`
  and add DWORD of `iexplore.exe` defaulted to `0` value.

## API

**TODO**: API is still settling out.

### Examples:

* [examples/mocha](./examples/mocha): Basic Mocha/Chai tests using WD promises
  and the [Rowdio Mocha Adapter](./adapters/mocha.js)

## WebdriverIO Guide

The full API to WebdriverIO is available at:
http://webdriver.io/api.html

## Contributions

Please see the [Contributions Guide](./CONTRIBUTING.md) for how to help out
with the plugin.

We test all changes with [Travis CI][trav]. Here's our current
[build status][trav_site]:

[![Build Status][trav_img]][trav_site]

[trav]: https://travis-ci.org/
[trav_img]: https://travis-ci.org/FormidableLabs/rowdio.svg
[trav_site]: https://travis-ci.org/FormidableLabs/rowdio
[trav_cfg]: ./.travis.yml

We also do multi-browser testing thanks to donated VM time from
[Sauce Labs][sauce] and [BrowserStack][bs].
Here's our Sauce Labs [build matrix][sauce_site]:

[![Sauce Test Status][sauce_img]][sauce_site]

[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/rowdio.svg
[sauce_site]: https://saucelabs.com/u/rowdio
[bs]: http://www.browserstack.com/

## Licenses
All code not otherwise specified is Copyright 2014 Formidable Labs, Inc.
Released under the [MIT](./LICENSE.txt) License.
