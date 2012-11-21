//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');
var Response = require('models/response');

function QuestionWithOptionsView(question, answer) {
  var content = answer ? answer.content : null;
  var response = answer ? Response.findOneById(answer.response_id) : null;
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var button = Ti.UI.createButton({
    title : "Pick",
    width : '80%'
  });
  self.add(button);

  var data = [];

  var options = question.options();

  button.addEventListener('click', function() {
    var optionsDialog = Ti.UI.createOptionDialog({
      options : options.map(function(option){ return option.content; }),
      title : question.content
    });
    
    optionsDialog.addEventListener('click', function(e){
      Ti.API.info(e.index);
    })
    
    optionsDialog.show();
  });

  var showSubQuestions = function(selectedRow) {
    if (!( selectedRow instanceof Ti.UI.PickerRow))
      selectedRow = picker.getSelectedRow(0);
    var option = Option.findOneById(selectedRow.id);
    Ti.API.info("Showing sub questions for" + option.content);
    _(self.getChildren()).each(function(childView) {
      if (childView != picker)
        self.remove(childView);
    });
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubQuestions();
    _(subQuestions).each(function(subQuestion) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      self.add(new QuestionView(subQuestion, subQuestionAnswer));
    });
  };

  if (content) {
    var selectedRow = null;
    _(data).each(function(option, index) {
      if (option.title == content) {
        picker.setSelectedRow(0, index);
        selectedRow = option;
      }
    });
    showSubQuestions(selectedRow);
  }

  self.getValue = function() {
    val = picker.getSelectedRow(null).getTitle();
    if (val == 'None')
      val = '';
    return val;
  };

  return self;
}

module.exports = QuestionWithOptionsView;
