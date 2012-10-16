//All the questoin in a survey
function ResponsesNewView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Response = require('models/response');

	self = Ti.UI.createScrollView({
		layout : 'vertical'
	});

	var answerFields = {};

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

		if (question.image_url) {
			var imageView = Ti.UI.createImageView({
				width : 100,
				height : 100,
				image : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, question.id.toString())
			});
			self.add(imageView);
		}

		if (question.type == 'RadioQuestion') {
			var valueField = Ti.UI.createPicker({
				color : '#336699',
				right : 5,
				left : 5,
			});

			var data = [];
			_(question.options()).each(function(option, i) {
				data[i] = Ti.UI.createPickerRow({
					title : option.content
				})
			})
			valueField.getValue = function() {
				return valueField.getSelectedRow(null).getTitle();
			}
			valueField.add(data);
			valueField.selectionIndicator = true;
		} else {
			var valueField = Ti.UI.createTextField({
				borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
				color : '#336699',
				right : 5,
				left : 5,
				editable : true
			});
		}

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
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		top : 10,
		width : '100%'
	});
	self.add(saveButton);

	saveButton.addEventListener('click', function(e) {
		var answersData = _(answerFields).map(function(fields, questionID) {
			Ti.API.info("questionid:" + questionID);
			Ti.API.info("content:" + fields['valueField'].getValue());
			return {
				'question_id' : questionID,
				'content' : fields.valueField.getValue()
			}
		});
		responseErrors = Response.validate(answersData);
		if (!_.isEmpty(responseErrors)) {
			displayErrors(responseErrors);
			alert("There were some errors in the response.");
		} else {
			Response.createRecord(surveyID, answersData);
			Ti.App.fireEvent('ResponsesNewView:savedResponse');
		}
	});

	return self;
}

module.exports = ResponsesNewView;
