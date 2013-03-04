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
    createRecords : function(data, surveyID, parentID, externalSyncHandler, categoryID) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(question) {
        if(question.image_in_base64) {
          var image = Ti.Utils.base64decode(question.image_in_base64);
          var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, question.id.toString());
          file.write(image);
        }

        var record = that.newRecord({
          id : question.id,
          content : question.content,
          survey_id : surveyID,
          max_length : question.max_length,
          mandatory : question.mandatory,
          image_url : question.image_url,
          type : question.type,
          min_value : question.min_value,
          max_value : question.max_value,
          parent_id : parentID,
          category_id : categoryID,
          identifier : question.identifier,
          order_number : question.order_number
        });
        record.save();
        records.push(record);
        record.fetchOptions(externalSyncHandler);
      });
      return records;
    }
  },

  objectMethods : {
    fetchOptions : function(externalSyncHandler) {
      Ti.API.info("In survey model fetchOptions Increment Sync handler is " + externalSyncHandler);
      var self = this;
      if (self.type != 'RadioQuestion' && self.type != 'DropDownQuestion' && self.type != 'MultiChoiceQuestion') {
        externalSyncHandler.notifySyncProgress();
        return;
      }
      var url = Ti.App.Properties.getString('server_url') + '/api/options?question_id=' + self.id;
      var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload : function(e) {
          Ti.API.info("Received text for options: " + this.responseText);
          var data = JSON.parse(this.responseText);
          var records = Option.createRecords(data, self.id, externalSyncHandler);
          externalSyncHandler.notifySyncProgress();
        },
        onerror : function(e) {
          Ti.API.info("Error");
          externalSyncHandler.notifySyncError({
            status : this.status
          });
        },
        timeout : 5000 // in milliseconds
      });
      client.open("GET", url);
      client.send({
        access_token : Ti.App.Properties.getString('access_token')
      });
    },

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
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Question;

