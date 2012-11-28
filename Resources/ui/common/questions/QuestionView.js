var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var PhotoQuestionView = require('ui/common/questions/PhotoQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');
var RatingQuestionView = require('ui/common/questions/RatingQuestionView');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');

//QuestionView Component Constructor
function QuestionView(question, answer) {
	var generateLabelTextForQuestion = function(question, errorText) {
		text = '';
		text += question.number() + ') ';
		text += question['content'];
		text += question.mandatory ? ' *' : '';
		text += question.max_length ? ' [' + question.max_length + ']' : '';
		text += question.max_value ? ' (<' + question.max_value + ')' : '';
		text += question.min_value ? ' (>' + question.min_value + ')' : '';
		text += errorText ? '\n' + errorText : '';
		return text;
	}
	var self = Ti.UI.createView({
	  backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
		layout : 'vertical',
		type : 'question',
		id : question.id,
		height : Titanium.UI.SIZE,
		answerID : answer ? answer.id : null
	});

	var label = Ti.UI.createLabel({
		color : '#000000',
		text : generateLabelTextForQuestion(question, ""),
		left : 5,
		color: Palette.PRIMARY_COLOR,
		font : {
		  fontSize: '20dip'
		}
	});
	self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));
	self.add(label);
	self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));


	if (question.image_url) {
		var imageView = Ti.UI.createImageView({
			width : 100,
			height : 100,
			image : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, question.id.toString())
		});
		self.add(imageView);
	}

	var valueField;
	var content = answer ? answer.content : null;

	if (question.type == 'RadioQuestion' || question.type == 'DropDownQuestion') {
		valueField = new QuestionWithOptionsView(question, answer);
	} else if (question.type == 'DateQuestion') {
		valueField = new DateQuestionView(question, content);
	} else if (question.type == 'PhotoQuestion') {
		var image = answer ? answer.image : null;
		valueField = new PhotoQuestionView(question, image);
	} else if (question.type == 'RatingQuestion') {
		valueField = new RatingQuestionView(question, content);
	} else if (question.type == 'MultiChoiceQuestion') {
		var optionIDs = answer ? answer.optionIDs() : null;
		valueField = new MultiChoiceQuestionView(question, optionIDs);
	} else {
		valueField = new BasicQuestionView(question, content);
	}

	self.add(valueField);
	self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));
	
	self.getLabel = function() {
	  return label;
	}
	
	self.getValueField = function() {
	  return valueField;
	}

	return self;
}

module.exports = QuestionView;
