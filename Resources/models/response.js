var _ = require('lib/underscore')._;
var Answer = require('models/answer');
var Choice = require('models/choice');
var progressBarView = require('ui/common/components/ProgressBar');
var Response = new Ti.App.joli.model({
  table : 'responses',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    user_id : 'INTEGER',
    organization_id : 'INTEGER',
    survey_id : 'INTEGER',
    web_id : 'INTEGER',
    status : 'TEXT',
    updated_at : 'TEXT',
    latitude : 'REAL',
    longitude : 'REAL'
  },

  methods : {
    createRecord : function(surveyID, status, answersData, location) {
      var record = this.newRecord({
        survey_id : surveyID,
        user_id : Ti.App.Properties.getString('user_id'),
        organization_id : Ti.App.Properties.getString('organization_id'),
        status : status,
        updated_at : parseInt(new Date().getTime()/1000, 10),
        latitude : location.latitude,
        longitude : location.longitude
      });
      record.save();
      _(answersData).each(function(answer) {
        Answer.createRecord(answer, record.id);
      });
      return true;
    },

    validate : function(answersData, status) {
      var errors = {};
      _(answersData).each(function(answerData) {
        var answerErrors = Answer.validate(answerData, status);
        if (!_.isEmpty(answerErrors)) {
          errors[answerData.question_id] = answerErrors;
        }
      });
      return errors;
    }
  },
  objectMethods : {
    prepRailsParams : function() {
      var answer_attributes = {};
      _(this.answers()).each(function(answer, index) {
        answer_attributes[index] = {};
        answer_attributes[index]['question_id'] = answer.question_id;
        answer_attributes[index]['updated_at'] = answer.updated_at;
        if (answer.web_id)
          answer_attributes[index]['id'] = answer.web_id;
        if (answer.hasChoices())
          answer_attributes[index]['option_ids'] = answer.optionIDs();
        else
          answer_attributes[index]['content'] = answer.content;
      });
      return answer_attributes;
    },

    update : function(status, answersData) {
      Ti.API.info("updating response");
      this.fromArray({
        'id' : this.id,
        'survey_id' : this.survey_id,
        'web_id' : this.web_id,
        'status' : status,
        'updated_at' : parseInt(new Date().getTime() / 1000, 10),
        'user_id' : Ti.App.Properties.getString('user_id'),
        'organization_id' : Ti.App.Properties.getString('organization_id'),        
        'latitude' : this.latitude,
        'longitude' : this.longitude
      });
      var self = this;
      this.deleteObsoleteAnswers(answersData);
      _(answersData).each(function(answerData) {
        var answer = Answer.findOneById(answerData.id);
        if (answer)
          answer.update(answerData.content);
        else
          Answer.createRecord(answerData, self.id);
      });
      this.save();
      Ti.App.fireEvent('updatedResponse');
      Ti.API.info("response updated at" + this.updated_at);
    },

    deleteObsoleteAnswers : function(answersData) {
      var answerIDs = _(answersData).map(function(answerData) {
        if (answerData.id)
          return answerData.id;
      });
      var obsoleteAnswers = _(this.answers()).select(function(answer) {
        Ti.API.info("answer id " + answer.id);
        return !_(answerIDs).include(answer.id);
      });
      _(obsoleteAnswers).each(function(answer) {
        answer.destroyChoices();
        answer.destroy();
      });
    },

    syncOnLoad : function(data) {
      var self = data.response;
      var responseText = data.responseText;
      Ti.API.info("Synced response successfully: " + responseText);
      self.has_error = false;

      var received_response = JSON.parse(responseText);
      Ti.API.info("Response parsed successfully");

      self.fromArray({
        'id' : self.id,
        'survey_id' : self.survey_id,
        'web_id' : received_response['id'],
        'status' : received_response['status'],
        'updated_at' : parseInt(new Date().getTime()/1000, 10),
        'latitude' : self.latitude,
        'longitude' : self.longitude,
        'user_id' : self.user_id,
        'organization_id': self.organization_id
      });
      self.save();

      _(self.answers()).each(function(answer, index) {
        var image = answer.image;
        var photoUpdatedAt = answer.photo_updated_at;
        answer.destroyChoices();
        answer.destroy();
        var new_answer = Answer.newRecord({
          'response_id' : self.id,
          'question_id' : received_response.answers[index].question_id,
          'web_id' : received_response.answers[index].id,
          'content' : received_response.answers[index].content,
          'updated_at' : parseInt(new Date().getTime()/1000, 10),
          'image' : image,
          'photo_updated_at' : photoUpdatedAt
        });
        new_answer.save();

        _(received_response.answers[index].choices).each(function(choice) {
          choice.answer_id = new_answer.id;
          Choice.newRecord(choice).save();
        });
      });

      _(self.answers()).each(function(answer) {
        if (answer.isImage() && answer.image) {
          Ti.API.info("Progress uploading image");
          progressBarView.setMessage("Uploading images...");
          progressBarView.updateMax(1);
          answer.uploadImage(received_response['status'], received_response['id']);
        }
      });

      if (received_response['status'] == "complete") {
        self.destroyAnswers();
        self.destroy();
      }
      Ti.App.fireEvent('response.sync.' + self.survey_id, {
        survey_id : self.survey_id
      });

    },

    syncOnError : function(data) {
      var message;
      var self = data.response;
      var responseText = data.responseText;
      if (this.status == '410') {// Response deleted on server
        Ti.API.info("Response deleted on server: " + responseText);
        self.destroyAnswers();
        self.destroy();
      } else if (this.status >= 400) {
        message = "Your server isn't responding. Sorry about that.";
      } else if (this.status === 0) {
        message = "Couldn't reach the server.";
      } else {
        Ti.API.info("Erroneous Response: " + responseText);
        self.has_error = true;
        message = "Some error occured";
      }
      Ti.App.fireEvent('response.sync.' + self.survey_id , {
        survey_id : self.survey_id,
        message : message
      });
    },

    sync : function() {
      var url = Ti.App.Properties.getString('server_url') + '/api/responses';
      var self = this;
      var params = {
        answers_attributes : this.prepRailsParams(),
        status : this.status,
        survey_id : this.survey_id,
        updated_at : parseInt(new Date(this.updated_at).getTime()/1000, 10),
        longitude : this.longitude,
        latitude : this.latitude,
        user_id : this.user_id,
        organization_id : this.organization_id,
        access_token : Ti.App.Properties.getString('access_token') 
      };

      var client = Ti.Network.createHTTPClient({
        // function called when the response data is available

        onload : function() {
          self.syncOnLoad({
            response : self,
            responseText : this.responseText
          });
        },
        onerror : function() {
          self.syncOnError({
            response : self,
            responseText : this.responseText
          });
        },
        timeout : 5000 // in milliseconds
      });

      var method = self.web_id ? "PUT" : "POST";
      url += self.web_id ? "/" + self.web_id : "";
      url += ".json";
      client.open(method, url);
      client.setRequestHeader("Content-Type", "application/json");
      client.send(JSON.stringify(params));
    },

    questions : function() {
      var Survey = require('models/survey');
      var survey = Survey.findOneById(this.survey_id);
      var firstLevelQuestions = survey.firstLevelQuestions();
      var questions = _.chain(firstLevelQuestions).map(function(question) {
        return question.withSubQuestions();
      }).flatten().value();

      return questions;
    },

    answers : function() {
      var questionIDs = _(this.questions()).map(function(question) {
        return question.id;
      });
      var answers = Answer.findBy('response_id', this.id);
      var sortedAnswers = _(answers).sortBy(function(answer) {
        return questionIDs.indexOf(answer.question().id);
      });
      return sortedAnswers;
    },

    destroyAnswers : function() {
      _(this.answers()).each(function(answer) {
        answer.destroyChoices();
        if (answer.isImage() && answer.image)
          Ti.Filesystem.getFile(answer.image).deleteFile();
        answer.destroy();
      });
    },

    answerForQuestion : function(questionID) {
      return _(this.answers()).find(function(answer) {
        return answer.question_id == questionID;
      });
    },

    hasImageAnswer : function() {
      return _(this.answers()).any(function(answer) {
        return (answer.isImage() && answer.image);
      });
    },

    identifierAnswers : function() {
      var identifiers = _(this.answers()).select(function(answer) {
        return answer.question().identifier;
      });
      if (_(identifiers).isEmpty()) {
        identifiers = this.answers().slice(0, 5);
      }
      return identifiers;

    },
    
    isComplete : function() {
      return this.status === "complete";
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Response;

