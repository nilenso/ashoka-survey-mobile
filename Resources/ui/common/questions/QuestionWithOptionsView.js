//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');
var Response = require('models/response');
var ButtonViewWithArrow = require('ui/common/components/ButtonViewWithArrow');

function QuestionWithOptionsView(question, answer, response, number, pageNumber, recordID) {
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
    Ti.App.fireEvent('show.sub.questions');
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
  
  self.getSubQuestions = function() {
    var option = options[1];
    Ti.API.info("Getting sub questions for" + option.content);    
    if(option.content == "None" && selectedIndex === 0) return null; //No sub-questions for the "None" option
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubElements();
    var sub_questions = _(subQuestions).map(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id, recordID) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      var questionView = new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, null, pageNumber, recordID);
      return _([questionView]).union(questionView.getSubQuestions());
    });
    return sub_questions;    
  }

  return self;
}

module.exports = QuestionWithOptionsView;
