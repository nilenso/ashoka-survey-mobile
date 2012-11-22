var _ = require('lib/underscore')._;
var Question = require('models/question');
var Response = require('models/response');
var Option = require('models/option');
var progressBarView = require('ui/common/components/ProgressBar');
var NetworkHelper = require('helpers/NetworkHelper');

var Survey = new Ti.App.joli.model({
  table : 'surveys',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    name : 'TEXT',
    description : 'TEXT',
    expiry_date : 'TEXT'
  },

  methods : {
    fetchSurveys : function() {
      var that = this;
      NetworkHelper.pingSurveyWeb( onSuccess = function() {
        Ti.App.fireEvent('surveys.fetch.start');
        progressBarView.setMessage("Fetching surveys...");
        var url = Ti.App.Properties.getString('server_url') + '/api/surveys';
        var client = Ti.Network.createHTTPClient({
          onload : function(e) {
            Ti.API.info("Received text: " + this.responseText);
            var data = JSON.parse(this.responseText);
            that.truncate();
            Question.truncate();
            Option.truncate();
            progressBarView.updateMax(data.length);
            _(data).each(function(surveyData) {
              var survey = that.createRecord(surveyData);
              survey.fetchQuestions();
            });
          },
          onerror : function(e) {
            Ti.API.debug(e.error);
            Ti.App.fireEvent('surveys.fetch.error', {
              status : this.status
            });
          },
          timeout : 5000 // in milliseconds
        });
        client.open("GET", url);
        client.send();
      });
    },

    createRecord : function(surveyData) {
      var record = this.newRecord({
        id : surveyData.id,
        name : surveyData.name,
        description : surveyData.description,
        expiry_date : surveyData.expiry_date
      });
      record.save();
      return record;
    },

    isEmpty : function() {
      return this.count() == 0;
    },

    syncAllResponses : function() {
      Ti.App.fireEvent('all.responses.sync.start');
      var surveyCount = _(this.all()).size();
      progressBarView.updateMax(surveyCount);
      _(this.all()).each(function(survey) {
        survey.syncResponses();
      });
    }
  },
  objectMethods : {
    syncResponses : function() {
      Ti.App.fireEvent('responses.sync.start');
      progressBarView.setMessage("Syncing responses...");

      var success_count = 0;
      var self = this;

      var syncHandler = function(data) {
        progressBarView.updateValue(1);
        Ti.API.info("Progress value updated by one here");
        Ti.API.info("All RESPONSES SYNCED: " + self.allResponsesSynced().toString())
        if (data.message) {
          Ti.App.fireEvent("survey.responses.sync", {
            message : data.message
          });
        } else if (data.survey_id == self.id) {
          if (self.allResponsesSynced()) {
            Ti.App.fireEvent("survey.responses.sync", self.syncSummary());
            Ti.API.info("SUMMARY: " + self.syncSummary());
          };
        }
        Ti.App.removeEventListener("response.sync", syncHandler);
      };

      progressBarView.updateMax(_(this.responses()).size());
      _(this.responses()).each(function(response) {
        Ti.API.info("response hs an image answer : " + response.hasImageAnswer());
        if (response.hasImageAnswer()) {
          progressBarView.keepVisible = true;
        }
        Ti.App.addEventListener("response.sync", syncHandler);
        response.sync();
      });
      progressBarView.updateValue(1);
    },

    responses : function() {
      this.response_objects = this.response_objects || Response.findBy('survey_id', this.id);
      return this.response_objects
    },

    allResponsesSynced : function() {
      return _(this.responses()).all(function(response) {
        return response.synced === true;
      });
    },

    syncSummary : function() {
      return _(this.responses()).countBy(function(response) {
        return response.has_error ? 'errors' : 'successes'
      });
    },

    fetchQuestions : function() {
      progressBarView.setMessage("Fetching questions...");
      var self = this;
      var url = Ti.App.Properties.getString('server_url') + '/api/questions?survey_id=' + self.id;
      var client = Ti.Network.createHTTPClient({
        onload : function(e) {
          Ti.API.info("Received text for questions: " + this.responseText);
          var data = JSON.parse(this.responseText);
          var number_of_option_questions = 0
          var number_of_images = 0
          var records = Question.createRecords(data, self.id);
          _(records).each(function(record) {
            if (record.type == 'RadioQuestion' || record.type == 'DropDownQuestion' || record.type == 'MultiChoiceQuestion') {
              number_of_option_questions++;
            }
            if (record.image_url) {
              number_of_images++;
              record.fetchImage();
            }
          });
          progressBarView.updateMax(number_of_option_questions + number_of_images);
          progressBarView.updateValue(1);
        },
        onerror : function(e) {
          Ti.App.fireEvent('surveys.fetch.error', {
            status : this.status
          });
          Ti.API.info("Error");
        },
        timeout : 5000 // in milliseconds
      });
      client.open("GET", url);
      client.send();
    },

    firstLevelQuestions : function() {
      var questions = Question.findBy('survey_id', this.id);
      var questionList = _.select(questions, function(question) {
        return question.parent_id == null;
      });
      var sortedQuestionList = _(questionList).sortBy(function(question) {
        return question.order_number
      });
      return sortedQuestionList;
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Survey;

