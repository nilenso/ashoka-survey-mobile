var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');

//QuestionView Component Constructor
function QuestionView(question, answer) {
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
  var self = Ti.UI.createView({
    layout : 'vertical',
    type : 'question',
    id : question.id,
    height : Titanium.UI.SIZE
  });

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

  var valueField;
  content = answer ? answer.content : null;

  if (question.type == 'RadioQuestion') {
    valueField = new QuestionWithOptionsView(question, content);
  } else if (question.type == 'DateQuestion') {
    valueField = new DateQuestionView(question, content);
  } else if (question.type == 'MultiChoiceQuestion') {
    var optionIDs = answer ? answer.optionIDs() : null;
    valueField = new MultiChoiceQuestionView(question, optionIDs);
  } else {
    valueField = new BasicQuestionView(question, content);
  }

  self.add(valueField);
  return self;
}

module.exports = QuestionView;
