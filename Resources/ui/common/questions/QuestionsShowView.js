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
		answerFields.push({
			'id' : question.id,
			'tf' : textField
		});
	});

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		height : 30,
		width : 200
	});
	self.add(saveButton);

	saveButton.addEventListener('click', function(e) {
		var i = 0;
		var response = {}
		response['answer_attributes'] = {}
		_(answerFields).each(function(answerField) {
			response['answer_attributes'][i] = {
				'question_id' : answerField.id,
				'content' : answerField.tf.getValue()
			};
			i++;
		});
		Ti.API.info(JSON.stringify(response));
	});

	return self;
}

module.exports = QuestionsShowView;
