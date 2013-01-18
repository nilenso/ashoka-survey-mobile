//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');
var Response = require('models/response');
var ButtonViewWithArrow = require('ui/common/components/ButtonViewWithArrow');

function QuestionWithOptionsView(question, answer, response, number) {
  var content = answer ? answer.content : null;
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

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
      showSubQuestions(selectedIndex);
    });

    optionsDialog.show();
  });

  var showSubQuestions = function(selectedRowID) {
    var option = options[selectedRowID];
    Ti.API.info("Showing sub questions for" + option.content);
    _(self.getChildren()).each(function(childView) {
      if (childView != button)
        self.remove(childView);
    });
    if(option.content == "None" && selectedRowID === 0) return; //No sub-questions for the "None" option
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubElements();
    _(subQuestions).each(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      self.add(new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber));
    });
  };

  if (content) {
    showSubQuestions(selectedIndex);
  }

  self.getValue = function() {
    if (selectedIndex === 0) {
      return '';
    } else {
      return optionTitles[selectedIndex];
    }
  };

  return self;
}

module.exports = QuestionWithOptionsView;
