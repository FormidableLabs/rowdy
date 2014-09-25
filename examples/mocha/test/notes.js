/**
 * Example tests.
 */
/*global $*/
var asserters = require("wd").asserters;
var client = require("../../../lib/browser").getClient();

// TODO: Encapsulate this somewhere / switch asserts...
var _wrapFn = function (fn) {
  return "(" + fn.toString() + "())";
};

describe("notes", function () {

  it("adds a note and deletes it", function (done) {
    client
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
      .waitFor(asserters.jsCondition(_wrapFn(function () {
        return $(".notes-item .note-delete").length === 0;
      })))

      .nodeify(done);
  });

  it("adds a note and edits it", function (done) {
    client
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
});

