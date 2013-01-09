var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var PhotoQuestionView = require('ui/common/questions/PhotoQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');
var CategoryView = require('ui/common/questions/CategoryView');
var RatingQuestionView = require('ui/common/questions/RatingQuestionView');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var Measurements = require('ui/common/components/Measurements');

function QuestionView(question, answer, response, number) {
  var self = Ti.UI.createView({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    layout : 'horizontal',
    type : question.type ? 'question' : 'category',
    id : question.id,
    height : Titanium.UI.SIZE,
    answerID : answer ? answer.id : null
  });

  var questionWrapper = Ti.UI.createView({
    height : Titanium.UI.SIZE,
    layout : 'vertical',
    right : Measurements.PADDING_X_SMALL,
    width : '90%'
  });
  var questionNumber = Ti.UI.createLabel({
    text : number + ".",
    left : Measurements.PADDING_X_SMALL,
    width : '5%',
    color : Palette.PRIMARY_COLOR,
    font : {
      fontSize : Measurements.FONT_MEDIUM
    },
    top : Measurements.PADDING_MEDIUM
  });

  self.add(questionNumber);
  self.add(questionWrapper);

  var questionText = question['content'];
  questionText += question.mandatory ? ' *' : '';

  questionWrapper.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));

  var labelsView = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var questionLabel = Ti.UI.createLabel({
    text : questionText,
    left : 5,
    color : Palette.PRIMARY_COLOR,
    font : {
      fontSize : Measurements.FONT_MEDIUM,
      fontWeight : question.type ? 'normal' : 'bold'
    }
  });
  labelsView.add(questionLabel);

  var constraintsText = '';
  constraintsText += question.max_length ? 'Maximum characters: ' + question.max_length : '';
  constraintsText += question.max_value ? 'Max: ' + question.max_value + ' ' : '';
  constraintsText += question.min_value ? 'Min: ' + question.min_value : '';

  var errorsLabel;

  questionWrapper.add(labelsView);
  questionWrapper.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));

  if (question.image_url) {
    var imageView = Ti.UI.createImageView({
      width : 100,
      height : 100,
      image : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, question.id.toString())
    });
    questionWrapper.add(imageView);
  }

  var valueField;
  var content = answer ? answer.content : null;

  if (question.type == 'RadioQuestion' || question.type == 'DropDownQuestion') {
    valueField = new QuestionWithOptionsView(question, answer, response, number);
  } else if (question.type == 'DateQuestion') {
    valueField = new DateQuestionView(question, content);
  } else if (question.type == 'PhotoQuestion') {
    var image = answer ? answer.image : null;
    valueField = new PhotoQuestionView(question, image);
  } else if (question.type == 'RatingQuestion') {
    valueField = new RatingQuestionView(question, content);
  } else if (question.type == 'MultiChoiceQuestion') {
    valueField = new MultiChoiceQuestionView(question, answer, response, number);
  } else if (question.type === undefined) { //Category
    valueField = new CategoryView(question, response, number);
  } else {
    valueField = new BasicQuestionView(question, content, constraintsText);
  }

  questionWrapper.add(valueField);
  questionWrapper.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '10dip'));

  self.setError = function(errorText) {
    self.has_error = true;
    errorsLabel = Ti.UI.createLabel({
      left : 5,
      color : Palette.DANGER,
      text : errorText,
      font : {
        fontSize : Measurements.FONT_MEDIUM    }
    });
    labelsView.add(errorsLabel);
  };

  self.resetError = function() {
    if(self.has_error) {
      labelsView.remove(errorsLabel);
      self.has_error = false;
    }
  };

  self.getValueField = function() {
    return valueField;
  };

  return self;
}

module.exports = QuestionView;
