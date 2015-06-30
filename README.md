roWDy
=====

A small, rambunctious configuration wrapper for
[WD.js](https://github.com/admc/wd) or
[WebdriverIO](http://webdriver.io/)

Main features:

* Easy configuration for local, Sauce Labs, BrowserStack testing.
* Invokes selenium server for local runs automagically.
* Integration helpers for Mocha tests.
* Auto-magic setting of Sauce Labs test status.
* Use your own test framework and test runner.


## Installation

First, install the library.

```
$ npm install --save-dev rowdy
```

### Local Selenium Server

If you want to have Rowdy run and control a local Selenium server, then
install the standalone client and run the install scripts:

```
$ npm install --save-dev selenium-standalone
$ npm run install-selenium
```

This shells out to `selenium-standalone` and is necessary at some point in your
integration if using the standalone (local) server.

The above steps are necessary if the configuration value
`settings.local.server.start` is `true`. You can skip the steps if you are
separately running / managing a local Selenium server or using a remote Selenium
farm (e.g., Sauce Labs or BrowserStack).

### Client Libraries

Then, install the necessary client libraries.

#### WD.js

```
$ npm install --save-dev wd
```

#### WebdriverIO

```
$ npm install --save-dev webdriverio saucelabs
```

_Note_: If using SauceLabs + WebdriverIO, we lazy `require` the Sauce Labs
module to upload results of "done" to your SL account.


## Configuration

By default Rowdy will lazy initialize the library's included
[config.js](./config.js) configuration file. (The first access of most
`rowdy.*` properties / methods will force this.)

However, on first import of Rowdy, you can override this behavior to do things
like override parts of the default configuration:

```js
// Start with default configuration.
var config = require("rowdy/config");
config.serverLogger = true;
// ... any other mutations

// Pass configuration in.
var rowdy = require("rowdy")(config);
```

Or, you can simply copy [config.js](./config.js) to your project, edit it
as appropriate and load:

```js
var config = require("./PATH/TO/config");
var rowdy = require("rowdy")(config);
```


## Local Usage

One of the Rowdy peer dependencies is `selenium-standalone`. This package
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
[github.com/SeleniumHQ/selenium/raw/selenium-2.45.0/javascript/safari-driver/prebuilt/SafariDriver.safariextz](https://github.com/SeleniumHQ/selenium/raw/selenium-2.45.0/javascript/safari-driver/prebuilt/SafariDriver.safariextz)
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

### Mocha Adapter

We provide full working examples of the [Mocha Adapter](./adapters/mocha.js):

* [examples/mocha/wd](./examples/mocha/wd): Basic Mocha/Chai tests with WD.js
* [examples/mocha/webdriverio](./examples/mocha/webdriverio): The same
  Mocha/Chai tests with WebdriverIO.

**TODO**: Add a full guide for configuring the adapter and (1) the options,
(2) `adapter.refreshClient()` use, (3) `adapter.client` use.


## Webdriver Client Guides

### WD.js

The full API to WD.js is available at:
https://github.com/admc/wd/blob/master/doc/api.md

### WebdriverIO

WebdriverIO provides the following useful documentation:

* http://webdriver.io/guide.html
* http://webdriver.io/api.html


## Contributions

Please see the [Contributions Guide](./CONTRIBUTING.md) for how to help out
with the plugin.

We test all changes with [Travis CI][trav]. Here's our current
[build status][trav_site]:

[![Build Status][trav_img]][trav_site]

We also do multi-browser testing thanks to donated VM time from
[Sauce Labs][sauce] and [BrowserStack][bs].
Here's our Sauce Labs [build matrix][sauce_site]:

[![Sauce Test Status][sauce_img]][sauce_site]


## Licenses
All code not otherwise specified is Copyright Formidable Labs, Inc.
Released under the [MIT](./LICENSE.txt) License.

[trav]: https://travis-ci.org/
[trav_img]: https://travis-ci.org/FormidableLabs/rowdy.svg
[trav_site]: https://travis-ci.org/FormidableLabs/rowdy
[trav_cfg]: ./.travis.yml
[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/rowdy.svg
[sauce_site]: https://saucelabs.com/u/rowdy
[bs]: http://www.browserstack.com/
