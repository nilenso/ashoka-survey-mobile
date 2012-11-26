var Survey = require('models/survey');
var Question = require('models/question');
var Option = require('models/option');
var Response = require('models/response');
var Answer = require('models/answer');
var Choice = require('models/choice');

var DatabaseHelper = {
  clearDatabase : function() {
    Survey.truncate();
    Question.truncate();
    Option.truncate();
    Response.truncate();
    Answer.truncate();
    Choice.truncate(); 
  }
}

module.exports = DatabaseHelper;
