var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Response = new Ti.App.joli.model({
	table : 'responses',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		survey_id : 'INTEGER',
		web_id : 'INTEGER',
		status : 'TEXT',
		updated_at : 'TEXT'
	},

	methods : {
		createRecord : function(surveyID, status, answersData) {
			var record = this.newRecord({
				survey_id : surveyID,
				status : status,
				updated_at : (new Date()).toString()
			});
			record.save();
			_(answersData).each(function(answer) {
				Answer.createRecord(answer, record.id);
			});
			Ti.API.info("Resp ID is " + record.id);
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
			var answers = Answer.findBy('response_id', this.id);
			var answer_attributes = {}
			_(answers).each(function(answer, index) {
				answer_attributes[index] = {};
				answer_attributes[index]['question_id'] = answer.question_id;
				if (answer.hasChoices())
					answer_attributes[index]['option_ids'] = answer.optionIDs();
				else
					answer_attributes[index]['content'] = answer.content;
			});
			return answer_attributes;
		},

		sync : function() {
			var url = Ti.App.Properties.getString('server_url') + '/api/responses';
			var self = this;
			this.synced = false;
			var params = {};
			params['answers_attributes'] = this.prepRailsParams();
			params['status'] = this.status;
			params['survey_id'] = this.survey_id;
			params['updated_at'] = this.updated_at;
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					Ti.API.info("Synced response successfully: " + this.responseText);
					self.has_error = false;
					self.synced = true;
					Ti.App.fireEvent('response.sync', {
						survey_id : self.survey_id
					});
					if (self.status == "complete") {
						var answers = self.answers();
						_(answers).each(function(answer) {
							answer.destroy();
						});
						self.destroy();
					} else {
						var received_response = JSON.parse(this.responseText);
						self.fromArray({
							'id' : self.id,
							'survey_id' : self.survey_id,
							'web_id' : received_response['id'],
							'status' : received_response['status'],
							'updated_at' : (new Date()).toString()
						});
						// self.web_id = received_response['id'];
						// self.status = received_response['status'];
						Ti.API.info("before save WEB ID: " + self.web_id);
						self.save()
						Ti.API.info("after save WEB ID: " + self.web_id);
					}
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.info("Erroneous Response: " + this.responseText);
					self.has_error = true;
					self.synced = true;
					Ti.App.fireEvent('response.sync', {
						survey_id : self.survey_id
					});
				},
				timeout : 5000 // in milliseconds
			});

			var method = self.web_id ? "PUT" : "POST";
			url += self.web_id ? "/" + self.web_id : "";
			url += ".json";
			Ti.API.info("method: " + method);
			client.open(method, url);
			client.setRequestHeader("Content-Type", "application/json");
			client.send(JSON.stringify(params));
		},

		answers : function() {
			return Answer.findBy('response_id', this.id)
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Response;

