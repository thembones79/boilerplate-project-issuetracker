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
module.exports.getIssues = function(callback, limit) {
  Issue.find(callback).limit(limit);
};

// Get Issues for Selected User
module.exports.getIssuesByQueryObject = function(obj) {
  Issue.find(obj.queryObject, obj.callback)
    .limit(obj.limit)
    .sort(obj.sortingOrder)
    .select(obj.filterObject);
};

// Get Issue
module.exports.getIssueById = function(id, callback) {
  Issue.findById(id, callback);
};

//Add Issue
module.exports.addIssue = function(issue, callback) {
  Issue.create(issue, callback);
};

//Update Issue
module.exports.updateIssue = function(id, issue, options, callback) {
  var query = { _id: id };
  var update = {
    name: issue.name
  };
  Issue.findOneAndUpdate(query, update, options, callback);
};

//Delete Issue
module.exports.deleteIssue = function(id, callback) {
  var query = { _id: id };
  Issue.remove(query, callback);
};
