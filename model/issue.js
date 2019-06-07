var mongoose = require("mongoose");

// Issue Schema
var issueSchema = mongoose.Schema({
  issue_title: {
    type: String,
    required: true
  },
  issue_text: {
    type: String,
    required: true
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    required: true
  },
  assigned_to: {
    type: String
  },
  open: {
    type: Boolean,
    default: true
  },
  status_text: {
    type: String
  }
});

var Issue = (module.exports = mongoose.model("Issue", issueSchema, "apitest"));

// Get Issues
module.exports.getIssuesByQueryObject = function(queryObject, callback) {
  Issue.find(queryObject, callback);
};

//Add Issue
module.exports.addIssue = function(issue, callback) {
  Issue.create(issue, callback);
};

//Update Issue
module.exports.updateIssue = function(id, issue, options, callback) {
  var query = { _id: id };
  Issue.findOneAndUpdate(query, issue, options, callback);
};

//Delete Issue
module.exports.deleteIssue = function(id, callback) {
  var query = { _id: id };
  Issue.deleteOne(query, callback);
};
