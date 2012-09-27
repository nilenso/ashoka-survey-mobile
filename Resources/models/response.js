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
		createRecord : function(surveyID, answerData) {
			var record = this.newRecord({
				survey_id : surveyID
			});
			record.save();
			_(answerData).each(function(answer) {
				Answer.createRecord(answer, record.id);
			});
			Ti.API.info("Resp ID is " + record.id);
			Ti.API.info("foooo" + this.all());
		},

		prepRailsParams : function(answers) {
			var answer_attributes = {}
			_(answers).each(function(answer, index) {
				answer_attributes[index] = {'content': answer.content, 'question_id': answer.question_id};
			});
			return answer_attributes;
		}, 
		
		sync : function(responseID) {
			var url = Ti.App.Properties.getString('server_url') + '/api/responses.json';
			var that = this;
			var response = this.findOneById(responseID);
			Ti.API.info(response);
			var answers = Answer.findBy('response_id', response.id);
			var params = {}
			params['answers_attributes'] = this.prepRailsParams(answers);
			params['mobile_id'] = responseID;
			params['survey_id'] = response.survey_id;
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					Ti.API.info("Received text: " + this.responseText);
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.info("fooooo errrooorr!!!");
				},
				timeout : 5000 // in milliseconds
			});
			// Prepare the connection.
			client.open("POST", url);
			client.setRequestHeader("Content-Type", "application/json")
			// Send the request.
			client.send(JSON.stringify(params));
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Response;

