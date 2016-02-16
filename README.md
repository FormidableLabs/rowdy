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

_Note_: Rowdy requires `webdriverio` at version `v3.0.0` or above.

#### Sauce Labs

If you intend to use Sauce Labs +
[guacamole](https://github.com/testarmada/guacamole)-provide environments, then:

```
$ npm install --save-dev guacamole
```

## Configuration

By default Rowdy will lazy initialize the library's included
[config.js](./config.js) configuration file. (The first access of most
`rowdy.*` properties / methods will force this.)

However, on first import of Rowdy, you can override this behavior to do things
like override parts of the default configuration:

```js
// Start with default configuration.
var config = require("rowdy/config");
config.server.logger = true;
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

### Local Examples

Start the local Selenium server on a different port:

```
$ ROWDY_OPTIONS='{ "server": { "port":4321 } }' \
  npm run test
```

Have client hit an already running local Selenium server without starting its
own:

```
# In one terminal
$  java -jar node_modules/selenium-standalone/.selenium/selenium-server/2.45.0-server.jar \
   -port 4321 \
   -Dphantomjs.binary.path=node_modules/phantomjs/lib/phantom/bin/phantomjs

# In another...
$ ROWDY_OPTIONS='{ "client": { "port":4321 }, "server": { "start":false } }' \
  npm run test
```

### Sauce Labs + Guacamole

We use [guacamole](https://github.com/testarmada/guacamole) to have
automatic access to all of the test environments Sauce Labs supports
(e.g., `firefox_38_Windows_2012_R2_Desktop`, `safari_7_OS_X_10_9_Desktop`).

If you `npm install guacamole`, then by default Rowdy will use and enable
those environments for use in configuration. Once installed, you can view
all of the available environments with:

```
# View environments
$ node_modules/.bin/guacamole

# Generate a cached shrinkwrap file
$ node_modules/.bin/guacamole --generate-shrinkwrap
```

Rowdy uses a cached version of Sauce Labs configurations in the
[`guacamole-shrinkwrap.json`](guacamole-shrinkwrap.json) file so that
`guacamole` doesn't query the Sauce Labs API at runtime.

**Disabling Guacamole**: If you _don't_ want to use the `guacamole` environments
with Sauce Labs, then you can skip the `npm install` and just make sure the
following is active in your Rowdy configuration:

```js
{
  options: {
    guacamole: {
      enabled: false
    }
  }
}
```

(By default `guacamole.enabled` is true if `npm` installed and false otherwise,
so if you use the default Rowdy configuration, no code changes are needed.)

And then you should add your own bespoke Sauce Labs settings in configuration
at:

```js
{
  settings: {
    sauceLabs: {
      "mac-safari-7": { /* Sauce Labs capabilities */ }
    }
  }
}
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


[trav]: https://travis-ci.org/
[trav_img]: https://travis-ci.org/FormidableLabs/rowdy.svg
[trav_site]: https://travis-ci.org/FormidableLabs/rowdy
[trav_cfg]: ./.travis.yml
[sauce]: https://saucelabs.com
[sauce_img]: https://saucelabs.com/browser-matrix/rowdy.svg
[sauce_site]: https://saucelabs.com/u/rowdy
[bs]: http://www.browserstack.com/
