var _ = require('lib/underscore')._;
var Response = require('models/response');

function CategoryView(category, response) {
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  Ti.API.info("Showing sub questions for" + category.content);
  var QuestionView = require('ui/common/questions/QuestionView');
  var subQuestions = category.firstLevelSubQuestions();
  _(subQuestions).each(function(subQuestion) {
    var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
    self.add(new QuestionView(subQuestion, subQuestionAnswer, response));
  });

  self.getValue = function() {
    return null;
  };

  return self;
}

module.exports = CategoryView;
