var _ = require('lib/underscore')._;
var Question = require('models/question');

var Choice = new Ti.App.joli.model({
	table : 'choices',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		option_id : 'INTEGER',
		answer_id : 'INTEGER'
	},

	methods : {
		createRecord : function(answerID, optionID) {
			var _ = require('lib/underscore')._;
			this.newRecord({
				option_id: optionID,
				answer_id: answerID
			}).save();
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Choice;

