var _ = require('lib/underscore')._;
var Question = require('models/question');
var QuestionView = require('ui/common/questions/QuestionView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');

function ResponseViewHelper() {
  var self = {};
  var PAGE_SIZE = 7;

  self.generateLabelTextForQuestion = function(question, errorText) {
    text = '';
    text += question.number() + ') ';
    text += question['content'];
    text += question.mandatory ? ' *' : '';
    text += question.max_length ? ' [' + question.max_length + ']' : '';
    text += question.max_value ? ' (<' + question.max_value + ')' : '';
    text += question.min_value ? ' (>' + question.min_value + ')' : '';
    text += errorText ? '\n' + errorText : '';
    return text;
  };

  self.resetErrors = function(questionViews) {
    _(questionViews).each(function(fields, questionID) {
      var question = Question.findOneById(questionID);
      var labelText = self.generateLabelTextForQuestion(question);
      fields.label.setText(labelText);
      fields.label.setColor('#000000');
    });
  };

  self.displayErrors = function(responseErrors, questionViews) {
    self.resetErrors(questionViews);
    Ti.API.info("All the errors:" + responseErrors);
    for (var answerErrors in responseErrors) {
      Ti.API.info("Answer errors for:" + answerErrors);
      for (var field in responseErrors[answerErrors]) {
        var question_id = answerErrors;
        var question = Question.findOneById(question_id);
        var label = questionViews[question_id].label;
        var labelText = self.generateLabelTextForQuestion(question, responseErrors[question_id][field]);
        label.setText(labelText);
        label.setColor("red");
        Ti.API.info(responseErrors[question_id][field]);
      }
    }
  };

  self.getQuestionViews = function(parent) {
    var foo = {};
    if (_(parent).isArray()) {
      var views = _.chain(parent).map(function(scrollView) {
        return scrollView.children;
      }).flatten().value();
    } else {
      var views = parent.getChildren() || [];
    }
    _(views).each(function(view) {
      if (view.type == 'question') {
        foo[view.id] = {
          'label' : view.getLabel(),
          'valueField' : view.getValueField(),
          'answerID' : view.answerID
        };
        Ti.API.info("label and value" + _(view.children).first() + _(view.children).last());
      }
      _(foo).extend(self.getQuestionViews(view));
    });
    return foo;
  };

  self.paginate = function(questions, scrollableView, buttons, response) {

    var pagedQuestions = _.chain(questions).groupBy(function(a, b) {
      return Math.floor(b / PAGE_SIZE);
    }).toArray().value();

    _(pagedQuestions).each(function(questions, pageNumber) {
      var questionsView = Ti.UI.createScrollView({
        layout : 'vertical'
      });

      _(questions).each(function(question) {
        var answer = response ? response.answerForQuestion(question.id) : undefined;
        var questionView = new QuestionView(question, answer);
        questionsView.add(questionView);
      })
      if (pageNumber + 1 === pagedQuestions.length) {
        questionsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
        _(buttons).each(function(button) {
          questionsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
          questionsView.add(button);
        });
      }

      scrollableView.addView(questionsView);
    });
  };

  self.scrollToFirstErrorPage = function(scrollableView, errors) {
    var views = scrollableView.getViews();
    scrollableView.scrollToView(views[0]);
  };
  
  return self;
};

module.exports = ResponseViewHelper;
