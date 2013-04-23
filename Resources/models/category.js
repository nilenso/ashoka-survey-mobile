var _ = require('lib/underscore')._;
var Question = require('models/question');
var progressBarView = require('ui/common/components/ProgressBar');
var Option = require('models/option');

var Category = new Ti.App.joli.model({
  table : 'categories',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    content : 'TEXT',
    survey_id : 'INTEGER',
    parent_id : 'INTEGER',
    order_number : 'INTEGER',
    category_id : 'INTEGER',
    type : 'TEXT'
  },

  methods : {
    createRecords : function(data, externalSyncHandler) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(category) {
        category.type = category.type || 'Category';
        var record = that.newRecord(category);
        record.save();
        records.push(record);
      });
      return records;
    }
  },
  
  objectMethods : {
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
    },

    isMR : function() {
      return (this.type === 'MultiRecordCategory');
    },

    parentCategory : function() {
      return Category.findOneById(this.category_id);
    },

    parentMR : function() {
      if(this.category_id) {
        if(this.parentCategory().isMR())
          return this.parentCategory();
        else
          return this.parentCategory().parentMR();
      }
      else if (this.parent_id) {
        return this.parentQuestion().parentMR();
      }
      return null;
    },

    parentQuestion : function() {
      var parentOption = Option.findOneById(this.parent_id);
      var parentQuestion = Question.findOneById(parentOption.question_id);
      return parentQuestion;
    },

    isFirstLevel : function() {
      return (this.parent_id === null && this.category_id === null);
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Category;

