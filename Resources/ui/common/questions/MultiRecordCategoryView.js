var _ = require('lib/underscore')._;
var Response = require('models/response');
var ButtonView = require('ui/common/components/ButtonView');

function MultiRecordCategoryView(multiRecordCategory, response, number, pageNumber) {
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var button = new ButtonView('Add a Record', { 'width' : '80%' });
  self.add(button);

  var QuestionView = require('ui/common/questions/QuestionView');
  var addSubQuestions = function() {
    Ti.API.info("Showing sub questions for" + multiRecordCategory.content);
    var subQuestions = multiRecordCategory.firstLevelSubQuestions();
    _(subQuestions).each(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      self.add(new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, null, pageNumber));
    });
  };

  button.addEventListener('click', addSubQuestions);

  self.getValue = function() {
    return null;
  };

  return self;
}

module.exports = MultiRecordCategoryView;
