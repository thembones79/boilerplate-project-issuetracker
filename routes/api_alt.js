/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var mongo = require("mongodb").MongoClient;
var url = process.env.DB;

module.exports = function(app) {
  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      var project = req.params.project;
      var query = req.query;

      mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
        var db = client.db("love");
        if (err) throw err;
        var parrots = db.collection(project);
        parrots.find(query).toArray(function(err, docs) {
          if (err) console.log(err);

          res.json(docs);
          client.close();
        });
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
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection(project);
          collection.insertOne(issue, function(err, data) {
            if (err) throw err;
            console.log(JSON.stringify(issue));
            res.json(issue);
            client.close();
          });
        });
      }
    })

    .put(function(req, res) {
      var project = req.params.project;
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
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection(project);

          collection.updateOne(
            {
              _id: req.body._id
            },
            {
              $set: {
                updated_on: new Date(),
                issue
              }
            },
            function(err, data) {
              if (err) {
                res.send("could not update " + req.body._id);
                client.close();
              } else {
                res.send("successfully updated");
                client.close();
              }
            }
          );
        });
      }
    })

    .delete(function(req, res) {
      var project = req.params.project;
      var _id = req.body._id;

      if (!_id) {
        res.send("_id error");
      } else {
        mongo.connect(url, { useNewUrlParser: true }, function(err, client) {
          var db = client.db("love");
          if (err) throw err;
          var collection = db.collection(project);

          collection.deleteOne(
            {
              _id
            },
            function(err, data) {
              if (err) {
                res.send("could not delete " + _id);
                client.close();
              } else {
                res.send("deleted " + _id);
                client.close();
              }
            }
          );
        });
      }
    });
};
