//OptionView Component Constructor
var _ = require('lib/underscore')._;

function OptionView(option, checked, response, number, pageNumber) {
  var Palette = require('ui/common/components/Palette');
  var row = Ti.UI.createView({
    height : Ti.UI.SIZE,
    layout : 'vertical'
  });

  var self = Ti.UI.createView({
    layout : 'horizontal',
    height : Titanium.UI.SIZE
  });
  row.add(self);

  var Measurements = require('ui/common/components/Measurements');

  var checkbox;
  if (Ti.Platform.osname == 'android') {
    checkbox = androidCheckbox(checked);
  } else {
    checkbox = iPhoneCheckbox(checked);
  }

  self.add(checkbox);

  checkbox.addEventListener('change', function(e) {
    var checked = e.value;
    if (checked) {
      Ti.API.info("Showing sub questions for" + option.content);
      showSubQuestions();
    } else {
      hideSubQuestions();
    }
  });

  var showSubQuestions = function() {
    var subQuestions = option.firstLevelSubElements();
    var QuestionView = require('ui/common/questions/QuestionView');
    _(subQuestions).each(function(subQuestion, index) {
      var subQuestionAnswer = response ? response.answerForQuestion(subQuestion.id) : null;
      Ti.API.info("Showing the sub question: " + subQuestion.content);
      var subQuestionNumber = number + '.' + (index + 1);
      row.add(new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, null, pageNumber));
    });
  };

  var hideSubQuestions = function() {
    _(row.getChildren()).each(function(childView) {
      if (childView != self)
        row.remove(childView);
    });
  };
  var size = Ti.Platform.displayCaps.platformHeight * 0.05;
  var label = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR,
    text : option.content,
    height : 'auto',
    width : 'auto',
    left : '5dip',
    font : {
      fontSize : Measurements.FONT_MEDIUM
    }
  });

  self.add(label);

  if (checked) {
    showSubQuestions();
  }

  return row;

  function iPhoneCheckbox(checked) {
    var checkbox = Ti.UI.createButton({
      title : '',
      height : 30,
      width : 30,
      left : 2,
      color : '#000',
      font : {
        fontWeight : 'bold'
      },
      value : false //value is a custom property in this casehere.
    });

    //Attach some simple on/off actions
    checkbox.on = function() {
      Ti.API.info(this.value);
      this.setTitle('✓');
      this.value = true;
    };

    checkbox.off = function() {
      Ti.API.info(this.value);
      this.setTitle('');
      this.value = false;
    };

    checkbox.addEventListener('click', function(e) {
      if (false == e.source.value) {
        e.source.on();
      } else {
        e.source.off();
      }
    });

    if (checked)
      checkbox.on();

    return checkbox;
  }

  function androidCheckbox(checked) {
    var basicSwitch = Ti.UI.createSwitch({
      value : false,
      style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
      height : size,
      width : size,
      left : 2,
      titleOn : "",
      titleOff : ""
    });

    if (checked)
      basicSwitch.setValue(true);

    return basicSwitch;
  }

}

module.exports = OptionView;
