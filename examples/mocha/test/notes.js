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

  it("adds a note and edits it", function (done) {
    adapter.client
      .url("http://backbone-testing.com/notes/app/")

      // Create a note.
      .setValue("input#note-new-input", "Edit Test")
      .click("button#note-create")
      .getText(".notes-item .note-title", function (err, text) {
        if (err) { return done(err); }
        expect(text).to.equal("Edit Test");
      })


      // Edit the note.
      .click(".notes-item .note-edit")
      .url(function (err, res) {
        if (err) { return done(err); }
        var url = res.value;
        expect(url).to.match(/\/notes\/app\/#note\/.*\/edit/);
      })
      .getValue("#input-title", function (err, val) {
        if (err) { return done(err); }
        expect(val).to.equal("Edit Test");
      })

      .call(done);
  });
});

