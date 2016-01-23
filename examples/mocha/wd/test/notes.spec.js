"use strict";

/**
 * Example tests.
 */
var adapter = global.adapter;
var asserters = require("wd").asserters;
var rowdy = require("../../../../index");
var jsFn = rowdy.helpers.js.fn;

describe("notes - wd.js", function () {

  it("adds a note and deletes it", function (done) {
    adapter.client
      .get("http://backbone-testing.com/notes/app/")

      // Create a note.
      .waitForElementByCss("input#note-new-input")
      .type("Delete Test")
      .waitForElementByCss("button#note-create")
      .click()
      .waitForElementByCss(".notes-item .note-title")
      .text()
      .then(function (text) {
        expect(text).to.equal("Delete Test");
      })

      // Delete a note
      .waitForElementByCss(".notes-item .note-delete")
      .click()
      .waitFor(asserters.jsCondition(jsFn(function () {
        /*global $*/
        return $(".notes-item .note-delete").length === 0;
      })))

      .nodeify(done);
  });

  it("adds a note and edits it", function (done) {
    adapter.client
      .get("http://backbone-testing.com/notes/app/")

      // Create a note.
      .waitForElementByCss("input#note-new-input")
      .type("Edit Test")
      .waitForElementByCss("button#note-create")
      .click()
      .waitForElementByCss(".notes-item .note-title")
      .text()
      .then(function (text) {
        expect(text).to.equal("Edit Test");
      })

      // Edit the note.
      .waitForElementByCss(".notes-item .note-edit")
      .click()
      .url()
      .then(function (url) {
        expect(url).to.match(/\/notes\/app\/#note\/.*\/edit/);
      })
      .waitForElementByCss("#input-title")
      .getValue()
      .then(function (val) {
        expect(val).to.equal("Edit Test");
      })

      .nodeify(done);
  });

  /*
   * As an alternative to `perTest: true` global configurations, clients can
   * instead generally rely on a per-suite client and conditionally call
   * `refreshClient` to get a new client.
   */
  describe("with refreshed (new) client", function () {

    beforeEach(function (done) {
      adapter.refreshClient(done);
    });

    it("checks the nav heading", function (done) {
      adapter.client
        .get("http://backbone-testing.com/notes/app/")

        // Check nav heading
        .waitForElementByCss(".navbar-brand")
        .text()
        .then(function (text) {
          expect(text).to.equal("Notes");
        })

        .nodeify(done);
    });
  });
});
