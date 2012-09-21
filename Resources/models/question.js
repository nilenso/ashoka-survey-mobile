var Question = new Ti.App.joli.model({
	table : 'question',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		survey_id : 'INTEGER'
	},

	methods : {
		createRecords : function(data, surveyID) {
			var _ = require('lib/underscore')._;
			var that = this;
			_(data).each(function(question) {
				var record = that.newRecord({
					id : question.id,
					content : question.content,
					survey_id : surveyID
				});
				record.save();
			});
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Question;

