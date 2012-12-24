var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var PhotoQuestionView = require('ui/common/questions/PhotoQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');
var RatingQuestionView = require('ui/common/questions/RatingQuestionView');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var Measurements = require('ui/common/components/Measurements');

function QuestionView(question, answer) {
  var self = Ti.UI.createView({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    layout : 'vertical',
    type : 'question',
    id : question.id,
    height : Titanium.UI.SIZE,
    answerID : answer ? answer.id : null
  });

  var questionText = question.number() + ') ';
  questionText += question['content'];
  questionText += question.mandatory ? ' *' : '';

  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));

  var labelsView = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var questionLabel = Ti.UI.createLabel({
    text : questionText,
    left : 5,
    color : Palette.PRIMARY_COLOR,
    font : {
      fontSize : Measurements.FONT_BIG    }
  });
  labelsView.add(questionLabel);

  var constraintsText = '';
  constraintsText += question.max_length ? 'Maximum characters: ' + question.max_length : '';
  constraintsText += question.max_value ? 'Max: ' + question.max_value + ' ' : '';
  constraintsText += question.min_value ? 'Min: ' + question.min_value : '';

  if (constraintsText !== '') {
    var constraintsLabel = Ti.UI.createLabel({
      text : constraintsText,
      left : 5,
      color : Palette.SECONDARY_COLOR_DARK,
      font : {
        fontSize : Measurements.FONT_MEDIUM      }
    });
    labelsView.add(constraintsLabel);
  }

  var errorsLabel = Ti.UI.createLabel({
    left : 5,
    color : Palette.DANGER,
    font : {
      fontSize : Measurements.FONT_MEDIUM    }
  });

  self.add(labelsView);
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));

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
    valueField = new MultiChoiceQuestionView(question, answer);
  } else if (question.type === undefined) { //Category
    valueField = new BasicQuestionView(question);
  } else {
    valueField = new BasicQuestionView(question, content);
  }

  self.add(valueField);
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));

  self.setError = function(errorText) {
    errorsLabel.setText(errorText);
    labelsView.add(errorsLabel);
  };

  self.resetError = function() {
    labelsView.remove(errorsLabel);
  };

  self.getValueField = function() {
    return valueField;
  };

  return self;
};

module.exports = QuestionView;
