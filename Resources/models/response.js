var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Response = new Ti.App.joli.model({
	table : 'responses',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		survey_id : 'INTEGER',
		web_id : 'INTEGER'
	},

	methods : {
		createRecord : function(surveyID, answersData) {
			var record = this.newRecord({
				survey_id : surveyID
			});
			record.save();
			_(answersData).each(function(answer) {
				Answer.createRecord(answer, record.id);
			});
			Ti.API.info("Resp ID is " + record.id);
			Ti.API.info("foooo" + this.all());
			return true;
		},

		validate : function(answersData) {
			var errors = {};
			_(answersData).each(function(answerData) {
				var answerErrors = Answer.validate(answerData);
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
				answer_attributes[index] = {
					'content' : answer.content,
					'question_id' : answer.question_id
				};
			});
			return answer_attributes;
		},

		sync : function() {
			var url = Ti.App.Properties.getString('server_url') + '/api/responses.json';
			var self = this;
			this.synced = false;
			var params = {}
			params['answers_attributes'] = this.prepRailsParams();
			params['mobile_id'] = this.id;
			params['survey_id'] = this.survey_id;
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					Ti.API.info("Received text: " + this.responseText);
					var answers = self.answers();
					_(answers).each(function(answer) {
						answer.destroy();
					});
					self.has_error = false;
					self.synced = true;
					Ti.App.fireEvent('response.sync', {
						survey_id : self.survey_id
					});
					self.destroy();
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					self.has_error = true;
					self.synced = true;
					Ti.App.fireEvent('response.sync', {
						survey_id : self.survey_id
					});
				},
				timeout : 5000 // in milliseconds
			});
			// Prepare the connection.
			client.open("POST", url);
			client.setRequestHeader("Content-Type", "application/json")
			// Send the request.
			client.send(JSON.stringify(params));
		},

		answers : function() {
			return Answer.findBy('response_id', this.id)
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Response;

