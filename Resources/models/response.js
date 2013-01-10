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
        if (answer.isImage() && answer.image){
          var image = Titanium.Filesystem.getFile(answer.image);
          answer_attributes[index]['photo'] = Ti.Utils.base64encode(image.read()).getText();
        }
      });
      return answer_attributes;
    },

    update : function(status, answersData) {
      Ti.API.info("updating response");
      var self = this;
      self.set('status', status);
      self.set('updated_at', parseInt(new Date().getTime() / 1000, 10));
      self.set('user_id', Ti.App.Properties.getString('user_id'));
      self.set('organization_id', Ti.App.Properties.getString('organization_id'));
      self.deleteObsoleteAnswers(answersData);

      _(answersData).each(function(answerData) {
        var answer = Answer.findOneById(answerData.id);
        if (answer)
          answer.update(answerData.content);
        else
          Answer.createRecord(answerData, self.id);
      });
      self.save();
      Ti.App.fireEvent('updatedResponse');
      Ti.API.info("response updated at" + self.updated_at);
    },

    deleteObsoleteAnswers : function(answersData) {
      var answerIDs = _(answersData).map(function(answerData) {
        if (answerData.id)
          return answerData.id;
      });
      var obsoleteAnswers = _(this.unsortedAnswers()).select(function(answer) {
        Ti.API.info("answer id " + answer.id);
        return !_(answerIDs).include(answer.id);
      });
      _(obsoleteAnswers).each(function(answer) {
        answer.destroyChoices();
        answer.destroy();
      });
    },

    syncOnLoad : function(data) {
      Ti.API.info("Received response successfully: " + data.responseText);
      var self = data.response;
      self.has_error = false;
      self.destroyAnswers();

      var received_response = JSON.parse(data.responseText);

      // for complete response
      if (received_response['status'] === "complete") {
        var  surveyID = self.survey_id;
        self.destroy();
        Ti.App.fireEvent('response.sync.' + self.id, {
          survey_id : surveyID,
          response_id : self.id
        });
        return;
      }

      // for incomplete response
      self.set('web_id', received_response['id']);
      self.set('status', received_response['status']);
      self.set('updated_at', parseInt(new Date().getTime()/1000, 10));
      self.save();

      _(received_response.answers).each(function(received_answer, index) {
        var file;
        if(received_answer.photo_in_base64) {
          var image = Ti.Utils.base64decode(received_answer.photo_in_base64);
          filename = "image_" + (new Date()).valueOf() + ".jpg";
          file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, filename);
          file.write(image);
        }

        var new_answer = Answer.newRecord({
          'response_id' : self.id,
          'question_id' : received_answer.question_id,
          'web_id' : received_answer.id,
          'content' : received_answer.content,
          'updated_at' : parseInt(new Date().getTime()/1000, 10),
          'image' : file && file.nativePath
        });
        new_answer.save();

        _(received_answer.choices).each(function(choice) {
          choice.answer_id = new_answer.id;
          Choice.newRecord(choice).save();
        });
      });

      Ti.App.fireEvent('response.sync.' + self.id, {
        survey_id : self.survey_id,
        response_id : self.id
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
      Ti.App.fireEvent('response.sync.' + self.id , {
        survey_id : self.survey_id,
        message : message,
        response_id : self.id
      });
    },

    sync : function() {
      var url = Ti.App.Properties.getString('server_url') + '/api/responses';
      var self = this;
      var params = {
        answers_attributes : this.prepRailsParams(),
        status : this.status,
        survey_id : this.survey_id,
        updated_at : parseInt(new Date(this.updated_at).getTime(), 10),
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
      var answers = this.unsortedAnswers();
      var questionIDs = _(this.questions()).map(function(question) {
        return question.id;
      });
      var sortedAnswers = _(answers).sortBy(function(answer) {
        return questionIDs.indexOf(answer.question_id);
      });
      return sortedAnswers;
    },

    unsortedAnswers : function() {
      return Answer.findBy('response_id', this.id);
    },

    destroyAnswers : function() {
      _(this.unsortedAnswers()).each(function(answer) {
        answer.destroyAll();
      });
    },

    answerForQuestion : function(questionID) {
      var response = this;
      var answers = Ti.App.joli.models.get('answers').all({
        where: {
          'response_id = ?': response.id,
          'question_id = ?': questionID
        }
      });
      return answers[0];
    },

    hasImageAnswer : function() {
      return _(this.unsortedAnswers()).any(function(answer) {
        return (answer.isImage() && answer.image);
      });
    },

    identifierAnswers : function() {
      var identifiers = _(this.unsortedAnswers()).select(function(answer) {
        return answer.question().identifier;
      });
      if (_(identifiers).isEmpty()) {
        identifiers = this.answers().slice(0, 5);
      }
      return identifiers;

    },

    isComplete : function() {
      return this.status === "complete";
    },

    isNotComplete : function() {
      return !this.isComplete();
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Response;

