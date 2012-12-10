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
      NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
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
          }
        });
        client.setTimeout(5000);
        client.open("GET", url);
        client.send({
          access_token : Ti.App.Properties.getString('access_token'),
          extra_surveys : that.idsForExpiredSurveysWithResponses()
        });
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
      var self = this;
      NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
        Ti.App.fireEvent('all.responses.sync.start');
        var surveyCount = _(self.all()).size();
        progressBarView.updateMax(surveyCount);

        var count = 0, errors = 0, successes = 0;
        var generateAllResponsesSyncSummary = function(data) {
          count++;
          if (data.message) {
            errors++;
          } else {
            successes++;
          }
          if (count === surveyCount) {
            Ti.App.fireEvent('all.responses.sync.complete', {
              successes : successes,
              errors : errors
            });
            Ti.App.removeEventListener('survey.responses.sync', generateAllResponsesSyncSummary);
          }
        };
        if (surveyCount > 0)
          Ti.App.addEventListener('survey.responses.sync', generateAllResponsesSyncSummary);

        _(self.all()).each(function(survey) {
          survey.syncResponses(true);
        });
      });
    },
    
    idsForExpiredSurveysWithResponses : function() {
      return _.chain(this.all())
      .filter(function(survey){
        return survey.isExpired() && survey.responseCount() > 0;
      })
      .map(function(survey){
        return survey.id;
      })
      .value().join();
    }
  },
  objectMethods : {
    syncResponses : function(forMultipleSurveys) {
      Ti.App.fireEvent('responses.sync.start');
      progressBarView.setMessage("Syncing responses...");

      var self = this;
      var responseSyncCount = 0;

      var syncHandler = function(data) {
        responseSyncCount++;
        if (data.message) {
          Ti.App.fireEvent("survey.responses.sync", {
            message : data.message
          });
        } else {
          if (self.allResponsesSynced(responseSyncCount)) {
            Ti.App.fireEvent("survey.responses.sync", self.syncSummary());
          };
        }
        progressBarView.updateValue(1);
        Ti.App.removeEventListener("response.sync." + self.id, syncHandler);
      };

      progressBarView.updateMax(this.responseCount());
      _(this.responses()).each(function(response) {
        if (response.hasImageAnswer()) {
          progressBarView.keepVisible = true;
        }
        Ti.App.addEventListener("response.sync." + self.id, syncHandler);
        response.sync();
      });

      if (_(this.responses()).isEmpty()) {
        Ti.API.info("No responses");
        Ti.App.fireEvent("survey.responses.sync", {
          empty : true
        });
      }
      if (forMultipleSurveys) {
        progressBarView.updateValue(1);
      }
    },

    responses : function() {
      this.response_objects = this.response_objects || this.responsesForCurrentUser();
      return this.response_objects
    },

    allResponsesSynced : function(successCount) {
      return _(this.responses()).size() === successCount;
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
      client.send({
        access_token : Ti.App.Properties.getString('access_token')
      });
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
    },

    responseCount : function() {
      return _(this.responses()).size();
    },

    completeResponseCount : function() {
      var query = new Ti.App.joli.query().select('*').from('responses');
      query.where('survey_id = ?', this.id);
      query.where('user_id = ?', Ti.App.Properties.getString('user_id'));
      query.where('status = ?', 'complete');
      return _(query.execute()).size();
    },

    incompleteResponseCount : function() {
      var query = new Ti.App.joli.query().select('*').from('responses');
      query.where('survey_id = ?', this.id);
      query.where('user_id = ?', Ti.App.Properties.getString('user_id'));
      query.where('status != ?', 'complete');
      return _(query.execute()).size();
    },

    responsesForCurrentUser : function() {
      var query = new Ti.App.joli.query().select('*').from('responses');
      query.where('survey_id = ?', this.id);
      query.where('user_id = ?', Ti.App.Properties.getString('user_id'));
      return query.execute();
    },

    isExpired : function() {
      return new Date(this.expiry_date) < new Date();
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Survey;

