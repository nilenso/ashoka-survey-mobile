//All the questoin in a survey
function ResponsesNewView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Survey = require('models/survey');
	var Response = require('models/response');
	var QuestionView = require('ui/common/questions/QuestionView');

	var self = Ti.UI.createScrollView({
		layout : 'vertical',
		height : Titanium.UI.SIZE
	});

	var answerFields = {};

	var generateLabelTextForQuestion = function(question, errorText) {
		text = '';
		text += question['content'];
		text += question.mandatory ? ' *' : '';
		text += question.max_length ? ' [' + question.max_length + ']' : '';
		text += question.max_value ? ' (<' + question.max_value + ')' : '';
		text += question.min_value ? ' (>' + question.min_value + ')' : '';
		text += errorText ? '\n' + errorText : '';
		return text;
	}
	var survey = Survey.findOneById(surveyID);
	var questions = survey.firstLevelQuestions();
	_(questions).each(function(question) {
		var label = Ti.UI.createLabel({
			color : '#000000',
			text : generateLabelTextForQuestion(question, ""),
			left : 5
		});
		self.add(label);

		if (question.image_url) {
			var imageView = Ti.UI.createImageView({
				width : 100,
				height : 100,
				image : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, question.id.toString())
			});
			self.add(imageView);
		}

		var valueField = new QuestionView(question);

		self.add(valueField);
		answerFields[question.id] = {
			'valueField' : valueField,
			'label' : label
		};
	});

	var resetErrors = function() {
		_(answerFields).each(function(fields, questionID) {
			var question = Question.findOneById(questionID);
			var labelText = generateLabelTextForQuestion(question);
			fields.label.setText(labelText);
			fields.label.setColor('#000000');
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
				var label = answerFields[question_id].label;
				var labelText = generateLabelTextForQuestion(question, responseErrors[question_id][field]);
				label.setText(labelText);
				label.setColor("red");
				Ti.API.info(responseErrors[question_id][field]);
			}
		}
	}
	var validateAndSaveAnswers = function(e, status) {
		var answersData = _(answerFields).map(function(fields, questionID) {
			Ti.API.info("questionid:" + questionID);
			Ti.API.info("content:" + fields['valueField'].getValue());
			return {
				'question_id' : questionID,
				'content' : fields.valueField.getValue()
			}
		});
		responseErrors = Response.validate(answersData, status);
		if (!_.isEmpty(responseErrors)) {
			displayErrors(responseErrors);
			alert("There were some errors in the response.");
		} else {
			Response.createRecord(surveyID, status, answersData);
			self.fireEvent('ResponsesNewView:savedResponse');
		}
	};

	var actionButtonsView = Ti.UI.createView({
		layout : 'horizontal',
		top : 10,
		left : '2%', 
		width : '100%'
	});
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		width : '48%'
	});
	actionButtonsView.add(saveButton);

	var completeButton = Ti.UI.createButton({
		title : 'Complete',
		width : '48%'
	});

	actionButtonsView.add(completeButton);
	self.add(saveButton);
	self.add(completeButton);

	completeButton.addEventListener('click', function(event) {
		validateAndSaveAnswers(event, "complete");
	});
	saveButton.addEventListener('click', function(event) {
		validateAndSaveAnswers(event, "incomplete");
	});

	return self;
}

module.exports = ResponsesNewView;
