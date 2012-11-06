function ResponseViewHelper() {
  var _ = require('lib/underscore')._;
  var Question = require('models/question');

  var generateLabelTextForQuestion = function(question, errorText) {
    text = '';
    text += question['content'];
    text += question.mandatory ? ' *' : '';
    text += question.max_length ? ' [' + question.max_length + ']' : '';
    text += question.max_value ? ' (<' + question.max_value + ')' : '';
    text += question.min_value ? ' (>' + question.min_value + ')' : '';
    text += errorText ? '\n' + errorText : '';
    return text;
  };

  var resetErrors = function(questionViews) {
    _(questionViews).each(function(fields, questionID) {
      var question = Question.findOneById(questionID);
      var labelText = generateLabelTextForQuestion(question);
      fields.label.setText(labelText);
      fields.label.setColor('#000000');
    });
  };

  var displayErrors = function(responseErrors, questionViews) {
    resetErrors(questionViews);
    Ti.API.info("All the errors:" + responseErrors);
    for (var answerErrors in responseErrors) {
      Ti.API.info("Answer errors for:" + answerErrors);
      for (var field in responseErrors[answerErrors]) {
        var question_id = answerErrors;
        var question = Question.findOneById(question_id);
        var label = questionViews[question_id].label;
        var labelText = generateLabelTextForQuestion(question, responseErrors[question_id][field]);
        label.setText(labelText);
        label.setColor("red");
        Ti.API.info(responseErrors[question_id][field]);
      }
    }
  };

  var getQuestionViews = function(parentView) {
    var foo = {}
    _(parentView.getChildren()).each(function(view) {
      if (view.type == 'question') {
        foo[view.id] = {
          'label' : _(view.children).first(),
          'valueField' : _(view.children).last(),
          'answerID' : view.answerID
        };
        Ti.API.info("label and value" + _(view.children).first() + _(view.children).last());
      }
      _(foo).extend(getQuestionViews(view));
    });
    return foo;
  };

  var self = {
    getQuestionViews : getQuestionViews,
    displayErrors : displayErrors,
    resetErrors : resetErrors,
    generateLabelTextForQuestion : generateLabelTextForQuestion
  };
  return self;
}

module.exports = ResponseViewHelper;
