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
    fetchSurveys : function(externalSyncHandler) {
      var that = this;
      NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
        Ti.App.fireEvent('surveys.fetch.start');
        var url = Ti.App.Properties.getString('server_url') + '/api/surveys';
        var client = Ti.Network.createHTTPClient({
          onload : function(e) {
            var data = JSON.parse(this.responseText);
            that.truncate();
            Question.truncate();
            Option.truncate();
            _(data).each(function(surveyData) {
              var survey = that.createRecord(surveyData);
              survey.fetchQuestions(externalSyncHandler);
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
      return this.count() === 0;
    },

    fetchAllQuestionsCount : function(callback) {
      NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
        var url = Ti.App.Properties.getString('server_url') + '/api/surveys/questions_count';
        var client = Ti.Network.createHTTPClient({
          onload : function() {
            var data = JSON.parse(this.responseText);
            Ti.API.info("There are " + data.count + " questions!");
            callback(data.count);
          },
          onerror : function(e) {
            Ti.API.debug("Questions count fetch failed");
            Ti.API.debug(e.error);
            Ti.App.fireEvent('surveys.fetch.error', {
              status : this.status
            });
          }
        });

        client.setTimeout(5000);
        client.open("GET", url);
        client.send({
          access_token : Ti.App.Properties.getString('access_token')
        });
      });
    },

    syncAllResponses : function(externalResponseSyncHandler) {
      var self = this;
      NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
        var surveyCount = _(self.all()).size();

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
          }
        };

        _(self.all()).each(function(survey) {
          survey.syncResponses(new SyncHandler(externalResponseSyncHandler.notifySyncProgress, generateAllResponsesSyncSummary));
        });
      });
    },

    allResponsesCount : function() {
      return _(this.all()).reduce(function(total, survey){
        return total + survey.responseCount();
      }, 0);
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
    syncResponses : function(externalResponseSyncHandler) {
      Ti.App.fireEvent('responses.sync.start');

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
            externalResponseSyncHandler.notifySyncComplete(self.syncSummary());
          }
        }
        externalResponseSyncHandler.notifySyncProgress();
        Ti.App.removeEventListener("response.sync." + self.id, syncHandler);
      };

      _(this.responses()).each(function(response) {
        Ti.App.addEventListener("response.sync." + self.id, syncHandler);
        response.sync();
      });

      if (_(this.responses()).isEmpty()) {
        Ti.API.info("No responses");
        Ti.App.fireEvent("survey.responses.sync", {
          empty : true
        });
      }
    },

    responses : function() {
      this.response_objects = this.response_objects || this.responsesForCurrentUser();
      return this.response_objects;
    },

    allResponsesSynced : function(successCount) {
      return _(this.responses()).size() === successCount;
    },

    syncSummary : function() {
      return _(this.responses()).countBy(function(response) {
        return response.has_error ? 'errors' : 'successes';
      });
    },

    fetchQuestions : function(externalSyncHandler) {
      Ti.API.info("In survey model fetchQuestions Increment Sync handler is " + externalSyncHandler);
      var self = this;
      var url = Ti.App.Properties.getString('server_url') + '/api/questions?survey_id=' + self.id;
      var client = Ti.Network.createHTTPClient({
        onload : function(e) {
          Ti.API.info("Received text for questions: " + this.responseText);
          var data = JSON.parse(this.responseText);
          var records = Question.createRecords(data, self.id, null, externalSyncHandler);
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
        return question.parent_id === null;
      });
      var sortedQuestionList = _(questionList).sortBy(function(question) {
        return question.order_number;
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

