var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var PhotoQuestionView = require('ui/common/questions/PhotoQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');
var CategoryView = require('ui/common/questions/CategoryView');
var MultiRecordCategoryView = require('ui/common/questions/MultiRecordCategoryView');
var RatingQuestionView = require('ui/common/questions/RatingQuestionView');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var Measurements = require('ui/common/components/Measurements');

function QuestionView(question, answer, response, number, lastQuestionNumber, pageNumber, record) {
  var type = (question.type.search('Question') > 0) ? 'question' : 'category';
  var self = Ti.UI.createView({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    layout : 'vertical',
    type : type,
    id : question.id,
    height : Titanium.UI.SIZE,
    answerID : answer ? answer.id : null,
    pageNumber : pageNumber,
    record : record
  });

  var questionText = number + '. ';
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
    valueField = new QuestionWithOptionsView(question, answer, response, number, pageNumber, record);
  } else if (question.type == 'DateQuestion') {
    valueField = new DateQuestionView(question, content);
  } else if (question.type == 'PhotoQuestion') {
    var image = answer ? answer.image : null;
    valueField = new PhotoQuestionView(question, image);
  } else if (question.type == 'RatingQuestion') {
    valueField = new RatingQuestionView(question, content);
  } else if (question.type == 'MultiChoiceQuestion') {
    valueField = new MultiChoiceQuestionView(question, answer, response, number, pageNumber);
  } else if (question.type === 'Category') { //Category
    valueField = new CategoryView(question, response, number, pageNumber, record);
  } else if (question.type === 'MultiRecordCategory'){
    valueField = new MultiRecordCategoryView(question, response, number, pageNumber);
  } else {
    valueField = new BasicQuestionView(question, content, constraintsText);
  }

  self.add(valueField);
  if(question.parent_id === null && number != lastQuestionNumber) {
    self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_BIG));
    self.add(new SeparatorView(Palette.SECONDARY_COLOR, Measurements.PADDING_XX_SMALL, { width : '90%' }));
  }

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
