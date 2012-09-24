//All the questoin in a survey
function QuestionsShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');

	self = Ti.UI.createView({
		layout : 'vertical'
	});

	var questions = Question.findBy('survey_id', surveyID);
	_(questions).each(function(question) {
		var label = Ti.UI.createLabel({
			color : '#000000',
			text : question['content'],
			height : 'auto',
			width : 'auto',
			left : 5
		});
		self.add(label);

		var answer_row = Titanium.UI.createTableViewRow();
		var textField = Ti.UI.createTextField({
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : '#336699',
			right : 5,
			left : 5,
			value : 'Answer',
			editable: true
		});
		self.add(textField);
	});

	return self;
}

module.exports = QuestionsShowView;
