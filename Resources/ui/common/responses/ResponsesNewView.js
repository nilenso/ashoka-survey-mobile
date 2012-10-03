//All the questoin in a survey
function ResponsesNewView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Response = require('models/response');

	self = Ti.UI.createView({
		layout : 'vertical'
	});

	var answerFields = [];

	var generateLabelTextForQuestion = function(question, errorText) {
		text = '';
		text += question['content'];
		text += question.mandatory ? ' *' : '';
		if (question.max_length) {
			text += ' [' + question.max_length + ']';
		}
		if (errorText) {
			text += '\n' + errorText;
		}
		return text;
	}
	var questions = Question.findBy('survey_id', surveyID);
	_(questions).each(function(question) {
		var label = Ti.UI.createLabel({
			color : '#000000',
			text : generateLabelTextForQuestion(question, ""),
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
			'tf' : textField,
			'label' : label
		});
	});

	var findAnswerFieldByQuestionID = function(questionID) {
		var targetField;
		_(answerFields).each(function(answerField) {
			if (questionID == answerField.id) {
				Ti.API.info("question id:" + questionID);
				targetField = answerField;
			}
		});
		return targetField;
	}
	var resetErrors = function() {
		_(answerFields).each(function(answerField) {
			var question = Question.findOneById(answerField.id);
			var labelText = generateLabelTextForQuestion(question);
			answerField.label.setText(labelText);
			answerField.label.setColor('#000000');
		});
	}

	var displayErrors = function(responseErrors) {
		resetErrors();
		Ti.API.info("All the errors:" + responseErrors);
		for (var answerErrors in responseErrors) {
			Ti.API.info("Answer errors for:" + answerErrors);
			for (var field in responseErrors[answerErrors]) {
				var question_id = answerErrors;
				var question = Question.findOneById(question_id);
				var label = findAnswerFieldByQuestionID(question_id).label;
				var labelText = generateLabelTextForQuestion(question, responseErrors[question_id][field]);
				label.setText(labelText);
				label.setColor("red");
				Ti.API.info(responseErrors[question_id][field]);
			}
		}
	}
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		height : 30,
		top : 10,
		width : '100%'
	});
	self.add(saveButton);

	saveButton.addEventListener('click', function(e) {
		var answersData = _(answerFields).map(function(field) {
			return {
				'question_id' : field.id,
				'content' : field.tf.getValue()
			}
		});
		responseErrors = Response.validate(answersData);
		if (responseErrors.hasOwnProperty('errors')) {
			displayErrors(responseErrors['errors']);
			alert("There were some errors in the response.");
		} else {
			Response.createRecord(surveyID, answersData);
			_(answerFields).each(function(field) {
				field.tf.setValue(null);
			});
			Ti.App.fireEvent('ResponsesNewView:savedResponse');
		}
	});

	return self;
}

module.exports = ResponsesNewView;
