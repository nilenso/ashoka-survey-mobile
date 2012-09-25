var _ = require('lib/underscore')._;

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
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Answer;

