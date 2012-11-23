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
    title : content || "None",
    width : '80%'
  });
  self.add(button);

  var data = [];

  var options = question.options();
  options.unshift({ content: "None" });
  var optionTitles = options.map(function(option){ return option.content; });
  
  var selectedIndex = content ? optionTitles.indexOf(content) : 0;

  button.addEventListener('click', function() {
    
    var optionsDialog = Ti.UI.createOptionDialog({
      options : optionTitles,
      selectedIndex : selectedIndex,
      title : question.content
    });
    
    if(content) {
      showSubQuestions(optionTitles.indexOf(content));
    }
    
    optionsDialog.addEventListener('click', function(e){
      selectedIndex = e.index;      
      button.setTitle(optionTitles[selectedIndex]);
      showSubQuestions(selectedIndex);
    })
    
    optionsDialog.show();
  });

  var showSubQuestions = function(selectedRowID) {
    var option = options[selectedRowID];
    Ti.API.info("Showing sub questions for" + option.content);
    _(self.getChildren()).each(function(childView) {
      if (childView != button)
        self.remove(childView);
    });
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.firstLevelSubQuestions();
    _(subQuestions).each(function(subQuestion) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      self.add(new QuestionView(subQuestion, subQuestionAnswer));
    });
  };
  
  if(content) {
    showSubQuestions(selectedIndex);
  }

  self.getValue = function() {
    if (selectedIndex == 0){
      return '';
    } else {
      return optionTitles[selectedIndex];
    }
  };

  return self;
}

module.exports = QuestionWithOptionsView;
