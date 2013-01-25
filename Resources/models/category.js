var _ = require('lib/underscore')._;
var Question = require('models/question');
var progressBarView = require('ui/common/components/ProgressBar');

var Category = new Ti.App.joli.model({
  table : 'categories',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    content : 'TEXT',
    survey_id : 'INTEGER',
    parent_id : 'INTEGER',
    order_number : 'INTEGER',
    category_id : 'INTEGER'
  },

  methods : {
    createRecords : function(data, surveyID, parentID, externalSyncHandler, categoryID) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(category) {
        var record = that.newRecord({
          id : category.id,
          content : category.content,
          survey_id : surveyID,
          parent_id : parentID,
          category_id : categoryID,
          order_number : category.order_number
        });
        record.save();
        records.push(record);
        record.fetchQuestionsAndCategories(externalSyncHandler);
      });
      return records;
    }
  },
  objectMethods : {
    fetchQuestionsAndCategories : function (externalSyncHandler) {
      Ti.API.info("In category model fetchQuestionsAndCategories Increment Sync handler is " + externalSyncHandler);
      var self = this;
      var url = Ti.App.Properties.getString('server_url') + '/api/categories/' + self.id;
      var client = Ti.Network.createHTTPClient({
        onload : function(e) {
          Ti.API.info("Received text for questions and categories: " + this.responseText);
          var data = JSON.parse(this.responseText);
          Question.createRecords(data.questions, self.survey_id, null, externalSyncHandler, self.id);
          Category.createRecords(data.categories, self.survey_id, null, externalSyncHandler, self.id);
        },
        onerror : function(e) {
          externalSyncHandler.notifySyncError({
            status : this.status
          });
          Ti.API.info("Error");
        },
        timeout : 5000 // in milliseconds
      });
      client.open("GET", url);
      client.send({
        access_token : Ti.App.Properties.getString('access_token')
      });
    },

    firstLevelSubQuestions : function() {
      var Question = require('models/question');
      var questions = Question.findBy('category_id', this.id);
      var categories = Category.findBy('category_id', this.id);
      var elements = questions.concat(categories);
      var sortedElements = _(elements).sortBy(function(element){ return element.order_number; });
      return sortedElements;
    },

    withSubQuestions : function() {
      firstLevelSubQuestions = this.firstLevelSubQuestions();
      var subQuestions = _.chain(firstLevelSubQuestions).map(function(question) {
          return question.withSubQuestions();
      }).flatten().value();

      return subQuestions;
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Category;

