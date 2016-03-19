History
=======

## 0.5.0

* Update to modern `phantom-prebuilt` with fallback to `phantom`.
  ([@kriuz][])

## 0.4.0
* **Breaking Change**: Update client webdriver teardown to use `.end()` call
  from `v3.0.0`-on. Installs below `webdriver@3.0.0.` will break.

## 0.3.6
* Add `tree-kill` to more emphatically SIGKILL the selenium server process
  on teardown.

## 0.3.5
* Add `helpers.webdriverio` with initial promise helper.

## 0.3.4
* Add `server.useExisting` option.

## 0.3.3
* Fix client logging options.

## 0.3.2
* Disable BrowserStack in CI.
* Upload Sauce Labs status on any client teardown.
* Support Sauce Labs connect tunnel identifiers.

## 0.3.1
* Add configurable server/client `port` option.

## 0.3.0
* **Breaking Changes**: Configuration `options` structure has changed.
* Use [`guacamole`](https://github.com/testarmada/guacamole) for Sauce Labs
  environments. ([@Maciek416][])

## 0.2.0

* **Breaking Changes**: Internal API has changed.
* Make the Mocha adapter an instantiated instance.
* Add `adapter.refreshClient()` for one-off new clients.
* Add `client.perTest` adapter option for new client for each test.
* Make `selenium-standalone` and optional dependency.
* Add full WebdriverIO client implementation.

## 0.1.4

* Make configuration lazy off example.
* Add `.LOG` static props to `Server` and `Client`.

## 0.1.3

* Add `rowdy.helpers.js`.

## 0.1.2

* Infer PhantomJS path using `require`.

## 0.1.1

* **Breaking Changes**: Internal API has changed.
* Switch to `adapter.client` synchronous property accessor.

## 0.1.0

* **Breaking Changes**: Internal API has changed.
* Refactor Client/Server to real classes.
* Add `serverLogging`, `serverDebug` logging options.

## 0.0.1 - 0.0.5

* Initial releases.

[@kriuz]: https://github.com/kriuz
[@Maciek416]: https://github.com/Maciek416
[@ryan-roemer]: https://github.com/ryan-roemer
