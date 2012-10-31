var Option = new Ti.App.joli.model({
	table : 'options',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		question_id : 'INTEGER',
	},

	methods : {
		createRecords : function(data, questionID) {
			var _ = require('lib/underscore')._;
			var that = this;
			var records = [];
			_(data).each(function(option) {
				var record = that.newRecord({
					id : option.id,
					content : option.content,
					question_id : questionID,
				});
				record.save();
				var Question = require('models/question');
				surveyID = Question.findById(questionID).survey_id;
				if (!_.isEmpty(option.questions)) {
					Question.createRecords(option.questions, surveyID, record.id);
				}
				records.push(record);
			});
			return records;
		},
	},
	
	objectMethods : {
		subQuestions : function() {
			var Question = require('models/question');
			return Question.findBy('parent_id', this.id);
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Option;

