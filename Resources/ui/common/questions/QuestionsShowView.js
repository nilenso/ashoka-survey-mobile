//All the questoin in a survey
function QuestionsShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');

	self = Ti.UI.createView({
		layout : 'vertical'
	});

	var answerFields = [];

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

		var textField = Ti.UI.createTextField({
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : '#336699',
			right : 5,
			left : 5,
			editable : true
		});
		self.add(textField);
		answerFields.push(textField);
	});

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		height : 30,
		width : 200
	});
	self.add(saveButton);

	saveButton.addEventListener('click', function(e) {
		var answers = []
		_(answerFields).each(function(answerField) {
			answers.push(answerField.getValue());
		});
		alert("saved all answers" + answers);
	});

	return self;
}

module.exports = QuestionsShowView;
