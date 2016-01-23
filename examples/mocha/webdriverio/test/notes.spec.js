"use strict";

/**
 * Example tests.
 */
var promiseDone = require("../../../../index").helpers.webdriverio.promiseDone;
var adapter = global.adapter;


describe("notes - webdriverio", function () {

  it("adds a note and deletes it", function (done) {
    var DELETE_WAIT = 2000;

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
      .waitForExist(".notes-item .note-delete", DELETE_WAIT, true)

      .finally(promiseDone(done));
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

      .finally(promiseDone(done));
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
        .url("http://backbone-testing.com/notes/app/")

        // Check nav heading
        .getText(".navbar-brand", function (err, text) {
          if (err) { return done(err); }
          expect(text).to.equal("Notes");
        })

        .finally(promiseDone(done));
    });
  });
});
