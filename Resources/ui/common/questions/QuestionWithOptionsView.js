//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');
var Response = require('models/response');
var ButtonViewWithArrow = require('ui/common/components/ButtonViewWithArrow');

function QuestionWithOptionsView(question, answer, response, number, recordID) {
  var content = answer ? answer.content : null;
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var childrenViews = [];

  var button = new ButtonViewWithArrow(content || 'None', { 'width' : '80%' });
  self.add(button);

  var data = [];

  var options = question.options();
  options.unshift({
    content : "None"
  });
  var optionTitles = options.map(function(option) {
    return option.content;
  });

  var selectedIndex = content ? optionTitles.indexOf(content) : 0;

  button.addEventListener('click', function() {

    var optionsDialog = Ti.UI.createOptionDialog({
      options : optionTitles,
      selectedIndex : selectedIndex,
      title : question.content
    });

    optionsDialog.addEventListener('click', function(e) {
      selectedIndex = e.index;
      if(selectedIndex < 0 || selectedIndex > _(options).size()) selectedIndex = 0;
      button.setTitle(optionTitles[selectedIndex]);
      showSubQuestions();
    });

    optionsDialog.show();
  });

  var showSubQuestions = function() {
    Ti.App.fireEvent('show.sub.questions');
  };

  if (content) {
    showSubQuestions();
  }

  self.getValue = function() {
    if (selectedIndex === 0) {
      return '';
    } else {
      return optionTitles[selectedIndex];
    }
  };

  self.getSubQuestions = function() {
    var option = options[selectedIndex];

    //No sub-questions for "None" option.
    if(selectedIndex === 0 || !option.hasSubElements())
      return null;

    if(childrenViews[selectedIndex]) {
      return _.chain(childrenViews[selectedIndex]).map(function(view){
        return _([view, view.getSubQuestions()]).compact();
      }).flatten().value();
    }

    childrenViews[selectedIndex] = [];


    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubElements();
    var subQuestionsWithChildren = _(subQuestions).map(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id, recordID) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      var questionView = new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, recordID);

      _(childrenViews[selectedIndex]).push(questionView);
      return _([questionView]).union(questionView.getSubQuestions());
    });
    return subQuestionsWithChildren;
  }

  return self;
}

module.exports = QuestionWithOptionsView;
