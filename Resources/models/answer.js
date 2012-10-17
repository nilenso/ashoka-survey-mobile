var _ = require('lib/underscore')._;
var Choice = require('models/choice');
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
			var question = Question.findOneById(answerData['question_id']);
			if (question.type == 'MultiChoiceQuestion') {
				var optionIds = answerData['content'];
				answerData['content'] = "";
				var answer = that.newRecord(answerData);
				answer.save();
				_(optionIds).each(function(option_id) {
					Choice.createRecord(answer.id, option_id);
				});
			} else {
				that.newRecord(answerData).save();
			}
		},

		validate : function(answerData) {
			var question = Question.findOneById(answerData.question_id);
			var errors = {};
			if (question.max_length && (answerData.content.length >= question.max_length))
				errors['max_length'] = "You have exceeded the maximum length for this question";
			if (question.mandatory && !answerData.content)
				errors['mandatory'] = "This question is mandatory";
			if (question.min_value && answerData.content < question.min_value)
				errors['mandatory'] = "You have exceeded the minimum limit";
			if (question.max_value && answerData.content > question.max_value)
				errors['mandatory'] = "You have exceeded the maximum limit";
			if (question.type == 'NumericQuestion' && isNaN(answerData.content))
				errors['mandatory'] = "You have to enter only a number";
			return errors;
		}
	},
	objectMethods : {
		hasChoices : function() {
			return Question.findOneById(this.question_id).type == 'MultiChoiceQuestion';
		},
		
		optionIDs : function() {
			return _(Choice.findBy('answer_id', this.id)).map(function(choice) {
				return choice.option_id;
			});
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Answer;

