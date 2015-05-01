/**
 * Example tests.
 */
var rowdio = require("../../../index");
var adapter = rowdio.adapters.mocha;

describe("notes", function () {

  it("adds a note and deletes it", function (done) {
    adapter.client
      .url("http://backbone-testing.com/notes/app/")

      // Create a note.
      .setValue("input#note-new-input", "Delete Test")
      .click("button#note-create")
      .getText(".notes-item .note-title", function (err, text) {
        if (err) { return done(err); }
        expect(text).to.equal("Delete Test");
      })

      // Delete a note
      .click(".notes-item .note-delete")
      .waitForExist(".notes-item .note-delete", false)

      .call(done);
  });

  it.skip("adds a note and edits it", function (done) {
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

      .call(done);
  });
});

