var Response = new Ti.App.joli.model({
	table : 'responses',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		survey_id : 'INTEGER'
	},

	methods : {
		createRecords : function(surveyID, answerData) {
			var _ = require('lib/underscore')._;
			this.newRecord({
				survey_id : surveyID
			}).save();
			_(answerData).each(function(answer) {
				// Answer.createRecords(answer)
			});
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

