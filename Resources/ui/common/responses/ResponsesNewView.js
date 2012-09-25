//All the questoin in a survey
function QuestionsShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Response = require('models/response');

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
		var answersData = _(answerFields).map(function(field) {
			return {
				'question_id' : field.id,
				'content' : field.tf.getValue()
			}
		});
		Response.createRecord(surveyID, answersData);
		_(answerFields).each(function(field){
			field.tf.setValue(null);
		});
		Ti.App.fireEvent('QuestionsShowView:savedResponse');		
	});

	return self;
}

module.exports = QuestionsShowView;
