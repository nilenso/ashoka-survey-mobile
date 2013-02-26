var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Record = new Ti.App.joli.model({
  table : 'records',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    response_id : 'INTEGER',
    category_id : 'INTEGER',
    web_id : 'INTEGER'
  },

  methods : {
    createRecords : function(answersInRecord, responseID){
      var groupedRecordAnwers = _(answersInRecord).groupBy(function(answer) {
        return answer.record.tempRecordId;
      });
      _(groupedRecordAnwers).each(function(recordAnswers, tempRecordId) {
        Record.createRecord(recordAnswers, responseID);
      });
    },

    createRecord : function(recordData, responseID){
      var Question = require('models/question');
      var question = Question.findOneById(recordData[0]['question_id']);
      var multiRecordCategoryID = question.category_id;
      Ti.API.info("Creating a record");
      var record = this.newRecord({
        response_id : responseID,
        category_id : multiRecordCategoryID
      });
      record.save();
      Ti.API.info(record.id);
      _(recordData).each(function(answer) {
        Answer.createRecord(answer, responseID, record.id);
      });
    }
  },
  objectMethods : {
    update : function(recordData) {
      var self = this;
      _(recordData).each(function(answerData) {
        var id = answerData.id;
        Answer.updateOrCreateById(id, answerData, self.response_id);
      });
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Record;

