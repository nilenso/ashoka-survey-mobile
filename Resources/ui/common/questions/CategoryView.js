var _ = require('lib/underscore')._;
var Response = require('models/response');

function CategoryView(category, response, number, pageNumber, recordID) {
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var childrenViews = null;

  Ti.API.info("Showing sub questions for" + category.content);

  self.getValue = function() {
    return null;
  };

  self.getSubQuestions = function() {
    if(childrenViews) {
      return _.chain(childrenViews).map(function(view){
        return _([view, view.getSubQuestions()]).compact();
      }).flatten().value();
    }

    childrenViews = [];

    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = category.firstLevelSubQuestions();
    return _(subQuestions).map(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id, recordID) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      var questionView = (new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, null, pageNumber, recordID));
      childrenViews.push(questionView);
      return _([questionView]).union(questionView.getSubQuestions());
    });
  };

  return self;
}

module.exports = CategoryView;
