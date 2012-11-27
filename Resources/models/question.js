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
    identifier : 'INTEGER',
    order_number : 'INTEGER'
  },

  methods : {
    createRecords : function(data, surveyID, parentID) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(question) {
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
          identifier : question.identifier,
          order_number : question.order_number
        });
        record.save();
        records.push(record);
        record.fetchOptions();
      });
      return records;
    }
  },

  objectMethods : {
    fetchImage : function() {
      if (this.image_url) {
        progressBarView.setMessage("Fetching an image...");
        var self = this;
        var url = Ti.App.Properties.getString('server_url') + self.image_url;
        var client = Ti.Network.createHTTPClient({
          onload : function(e) {
            Ti.API.info("Downloaded image from " + self.image_url);
            var data = this.responseData;
            var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, self.id.toString());
            f.write(data);
            progressBarView.updateValue(1);
          },
          onerror : function(e) {
            Ti.App.fireEvent('surveys.fetch.error', {
              status : this.status
            });
            Ti.API.info("Error downloading image from " + self.image_url);
          },
          timeout : 5000 // in milliseconds
        });
        client.open("GET", url);
        client.setRequestHeader('Cookie', Ti.App.Properties.getString('auth_cookie'));
        client.send();
      }
    },
    fetchOptions : function() {
      progressBarView.setMessage("Fetching options and sub questions...");

      var self = this;
      if (self.type != 'RadioQuestion' && self.type != 'DropDownQuestion' && self.type != 'MultiChoiceQuestion')
        return;
      var url = Ti.App.Properties.getString('server_url') + '/api/options?question_id=' + self.id;
      var numberOfOptionSubQuestions = 0;
      var client = Ti.Network.createHTTPClient({
        // function called when the response data is available
        onload : function(e) {
          Ti.API.info("Received text for options: " + this.responseText);
          var data = JSON.parse(this.responseText);
          var records = Option.createRecords(data, self.id);
          _(records).each(function(record) {
            _(record.subQuestions()).each(function(subQuestion) {
              if (subQuestion.type == 'RadioQuestion' || subQuestion.type == 'DropDownQuestion' || subQuestion.type == 'MultiChoiceQuestion') {
                numberOfOptionSubQuestions++;
              }
            });
          });

          progressBarView.updateMax(numberOfOptionSubQuestions);
          progressBarView.updateValue(1);
          Ti.App.fireEvent('surveys.questions.options.fetch.done', {
            number_of_option_sub_questions : numberOfOptionSubQuestions
          });
        },
        onerror : function(e) {
          Ti.API.info("Error");
          Ti.App.fireEvent('surveys.fetch.error', {
            status : this.status
          });
        },
        timeout : 5000 // in milliseconds
      });
      client.open("GET", url);
      client.setRequestHeader('Cookie', Ti.App.Properties.getString('auth_cookie'));
      client.send();
    },

    options : function() {
      return Option.findBy('question_id', this.id);
    },

    parentQuestion : function() {
      var parentOption = Option.findOneById(this.parent_id);
      var parentQuestion = Question.findOneById(parentOption.question_id);
      return parentQuestion;
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

    withSiblings : function() {
      if (this.parent_id === null) {
        var Survey = require('models/survey');
        var survey = Survey.findOneById(this.survey_id);
        return survey.firstLevelQuestions();
      } else {
        var questions = Question.findBy('parent_id', this.parent_id);
        return _(questions).sortBy(function(question) {
          return question.order_number;
        });
      }
    },

    number : function() {
      var siblingIDs = _(this.withSiblings()).map(function(question) {
        return question.id; s
      });
      if (this.parent_id === null) {
        return (siblingIDs.indexOf(this.id)) + 1;
      } else {
        return this.parentQuestion().number() + '.' + ((siblingIDs.indexOf(this.id)) + 1);
      }
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Question;

