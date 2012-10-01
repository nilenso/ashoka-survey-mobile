var _ = require('lib/underscore')._;
var Question = require('models/question');

var Answer = new Ti.App.joli.model({
	table : 'answers',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		response_id : 'INTEGER',
		question_id : 'INTEGER'
	},

	methods : {
		createRecord : function(answerData, responseID) {
			var _ = require('lib/underscore')._;
			var that = this;
			answerData.response_id = responseID
			that.newRecord(answerData).save();
			Ti.API.info("boooo" + _(this.all()).map(function(answer) {
				return answer.response_id
			}));
		},
		
		valid : function(answerData) {
			var question = Question.findOneById(answerData.question_id);
			if(question.max_length && (answerData.content > question.max_length)) {
				return false;
			} else if(question.mandatory && !answerData.content) {
				return false;
			} else {
				return true;
			}
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Answer;

