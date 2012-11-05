var BasicQuestionView = require('ui/common/questions/BasicQuestionView');
var DateQuestionView = require('ui/common/questions/DateQuestionView');
var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');

//QuestionView Component Constructor
function QuestionView(question, answer) {
  var self;
  content = answer? answer.content : null;
  
  if (question.type == 'RadioQuestion') {
    self = new QuestionWithOptionsView(question, content);
  } else if (question.type == 'DateQuestion') {
    self = new DateQuestionView(question, content);
  } else if (question.type == 'MultiChoiceQuestion') {
    var optionIDs = answer ? answer.optionIDs() : null;
    self = new MultiChoiceQuestionView(question, optionIDs);
  } else {
    self = new BasicQuestionView(question, content);
  }

  return self;
}

module.exports = QuestionView;
