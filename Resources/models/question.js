var _ = require('lib/underscore')._;
var Option = require('models/option');
var progressBarView = require('ui/common/components/ProgressBar');

var Question = new Ti.App.joli.model({
  table : 'questions',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    content : 'TEXT',
    survey_id : 'INTEGER',
    mandatory : 'INTEGER',
    max_length : 'INTEGER',
    image_url : 'TEXT',
    type : 'TEXT',
    max_value : 'INTEGER',
    min_value : 'INTEGER',
    parent_id : 'INTEGER',
    category_id : 'INTEGER',
    identifier : 'INTEGER',
    order_number : 'INTEGER'
  },

  methods : {
    createRecords : function(data, externalSyncHandler) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(question) {
        if(question.image_in_base64) {
          var image = Ti.Utils.base64decode(question.image_in_base64);
          var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, question.id.toString());
          file.write(image);
        }

        var record = that.newRecord(question);
        record.save();
        records.push(record);
        Option.createRecords(question.options, externalSyncHandler);
        externalSyncHandler.notifySyncProgress();
      });
      return records;
    }
  },

  objectMethods : {

    options : function() {
      var query = new Ti.App.joli.query().select('*').from('options');
      query.where('question_id = ?', this.id);
      query.order('order_number');
      return query.execute();
    },

    parentCategory : function() {
      return require('models/category').findOneById(this.category_id);
    },

    parentQuestion : function() {
      var parentOption = Option.findOneById(this.parent_id);
      var parentQuestion = Question.findOneById(parentOption.question_id);
      return parentQuestion;
    },

    parentMR : function() {
      if(this.category_id) {
        if(this.parentCategory().isMR()) {
          Ti.API.info("Should be here!");
          return this.parentCategory();
        }
        else {
          return this.parentCategory().parentMR();
        }
      }
      else if (this.parent_id) {
        return this.parentQuestion().parentMR();
      }
      return null;
    },

    parentOption : function() {
      return Option.findOneById(this.parent_id);
    },

    subQuestions : function() {
      var subQuestionsForAllOptions = _.chain(this.options()).map(function(option) {
        return option.subQuestions();
      }).flatten().value();
      return subQuestionsForAllOptions;
    },

    withSubQuestions : function() {
      return _([this, this.subQuestions()]).flatten();
    },

    isPhotoQuestion : function() {
      return this.type === 'PhotoQuestion';
    },

    isMultiChoiceQuestion : function() {
      return this.type === 'MultiChoiceQuestion';
    },

    isNumericQuestion : function() {
      return this.type === 'NumericQuestion';
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Question;

