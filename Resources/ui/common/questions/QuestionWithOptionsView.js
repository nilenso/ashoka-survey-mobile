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

  var picker = Ti.UI.createPicker({
    color : '#336699',
    right : 5,
    left : 5
  });

  var data = [];

  data.push(Ti.UI.createPickerRow({
    title : 'None'
  }));

  _(question.options()).each(function(option) {
    Ti.API.info("foo");
    var optionRow = Ti.UI.createPickerRow({
      title : option.content,
      id : option.id
    });
    data.push(optionRow);
  });

  picker.add(data);
  picker.selectionIndicator = true;

  self.add(picker);
  var showSubQuestions = function(selRow) {
    if(!(selRow instanceof Ti.UI.PickerRow)) selRow = picker.getSelectedRow(0);
    var option = Option.findOneById(selRow.id);

    _(self.getChildren()).each(function(childView) {
      if (childView != picker)
        self.remove(childView);
    });
    var QuestionView = require('ui/common/questions/QuestionView');
    var subQuestions = option.subQuestions();
    _(subQuestions).each(function(subQuestion) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      self.add(new QuestionView(subQuestion, subQuestionAnswer));
    });
  };

  picker.addEventListener('change', showSubQuestions);

  if (content) {
    var selectedRow = null;
    _(data).each(function(option, index) {
      if (option.title == content)
        picker.setSelectedRow(0, index);
        selectedRow = option;
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
