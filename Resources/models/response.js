var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Response = new Ti.App.joli.model({
	table : 'responses',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		survey_id : 'INTEGER'
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

		prepRailsParams : function(answersData) {
			var response = {};
			response['answer_attributes'] = {}
			_(answersData).each(function(answerData, index) {
				response['answer_attributes'][index] = answerData;
			});
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Response;

