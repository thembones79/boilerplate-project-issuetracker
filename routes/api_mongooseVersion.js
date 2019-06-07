/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var mongoose = require("mongoose");

var Issue = require("../model/issue");

// Connect to mongoose
mongoose.connect(process.env.DB, {
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);
var db = mongoose.connection;

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      var query = req.query;

      Issue.getIssuesByQueryObject(query, function(err, issues) {
        if (err) {
          res.send(err.message);
          console.log(err);
        }
        res.json(issues);
      });
    })

    .post(function(req, res) {
      var project = req.params.project;

      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        open: true,
        status_text: req.body.status_text || ""
      };
      if (!issue.issue_title || !issue.issue_text || !issue.created_by) {
        res.send("no inputs");
      } else {
        Issue.addIssue(issue, function(err, issue) {
          if (err) {
            res.send(err.message);
            console.log(err);
          }
          res.json(issue);
        });
      }
    })

    .put(function(req, res) {
      var project = req.params.project;
      var id = req.body._id;
      var issue = req.body;

      if (
        !issue.issue_title &&
        !issue.issue_text &&
        !issue.created_by &&
        !issue.status_text &&
        !issue.assigned_to &&
        !issue.open
      ) {
        res.send("no updated field sent");
      } else {
        issue.updated_on = new Date();
        Issue.updateIssue(
          id,
          issue,
          { new: true, useFindAndModify: false },
          function(err, data) {
            if (err) {
              res.send("could not update " + id);
            } else {
              res.send("successfully updated");
            }
          }
        );
      }
    })

    .delete(function(req, res) {
      var project = req.params.project;
      var id = req.body._id;

      if (!id) {
        res.send("_id error");
      } else {
        Issue.deleteIssue(id, function(err, data) {
          if (err) {
            res.send("could not delete " + id);
          } else {
            res.send("deleted " + id);
          }
        });
      }
    });
};
