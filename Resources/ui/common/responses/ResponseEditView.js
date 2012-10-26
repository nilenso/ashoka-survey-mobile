//All the questoin in a survey
function ResponseEditView(responseID) {
  var _ = require('lib/underscore')._;
  var Question = require('models/question');
  var Answer = require('models/answer');
  var Response = require('models/response');
  var QuestionView = require('ui/common/questions/QuestionView');
  var DateQuestionView = require('ui/common/questions/DateQuestionView');
  var QuestionWithOptionsView = require('ui/common/questions/QuestionWithOptionsView');
  var MultiChoiceQuestionView = require('ui/common/questions/MultiChoiceQuestionView');

  var self = Ti.UI.createScrollView({
    layout : 'vertical'
  });

  var answerFields = {};

  var generateLabelTextForQuestion = function(question, errorText) {
    text = '';
    text += question['content'];
    text += question.mandatory ? ' *' : '';
    text += question.max_length ? ' [' + question.max_length + ']' : '';
    text += question.max_value ? ' (<' + question.max_value + ')' : '';
    text += question.min_value ? ' (>' + question.min_value + ')' : '';
    text += errorText ? '\n' + errorText : '';
    return text;
  }
  var answers = Answer.findBy('response_id', responseID);
  _(answers).each(function(answer) {
    var question = answer.question();
    var label = Ti.UI.createLabel({
      color : '#000000',
      text : generateLabelTextForQuestion(question, ""),
      height : 'auto',
      width : 'auto',
      left : 5
    });
    self.add(label);

    if (question.image_url) {
      var imageView = Ti.UI.createImageView({
        width : 100,
        height : 100,
        image : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, question.id.toString())
      });
      self.add(imageView);
    }

    var valueField;
    if (question.type == 'RadioQuestion') {
      valueField = new QuestionWithOptionsView(question, answer.content);
    } else if (question.type == 'DateQuestion') {
      valueField = new DateQuestionView(question, answer.content);
    } else if (question.type == 'MultiChoiceQuestion') {
      valueField = new MultiChoiceQuestionView(question, answer.optionIDs());
    } else {
      valueField = new QuestionView(question, answer.content);
    }

    self.add(valueField);
    answerFields[question.id] = {
      'valueField' : valueField,
      'label' : label,
      'answerID' : answer.id
    };
  });

  var resetErrors = function() {
    _(answerFields).each(function(fields, questionID) {
      var question = Question.findOneById(questionID);
      var labelText = generateLabelTextForQuestion(question);
      fields.label.setText(labelText);
      fields.label.setColor('#000000');
    });
  }
  var displayErrors = function(responseErrors) {
    resetErrors();
    Ti.API.info("All the errors:" + responseErrors);
    for (var answerErrors in responseErrors) {
      Ti.API.info("Answer errors for:" + answerErrors);
      for (var field in responseErrors[answerErrors]) {
        var question_id = answerErrors;
        var question = Question.findOneById(question_id);
        var label = answerFields[question_id].label;
        var labelText = generateLabelTextForQuestion(question, responseErrors[question_id][field]);
        label.setText(labelText);
        label.setColor("red");
        Ti.API.info(responseErrors[question_id][field]);
      }
    }
  }
  var validateAndUpdateAnswers = function(e, status) {
    var answersData = _(answerFields).map(function(fields, questionID) {
      Ti.API.info("questionid:" + questionID);
      Ti.API.info("content:" + fields['valueField'].getValue());
      return {
        'id' : fields.answerID,
        'question_id' : questionID,
        'content' : fields.valueField.getValue()
      };
    });
    responseErrors = Response.validate(answersData, status);
    if (!_.isEmpty(responseErrors)) {
      displayErrors(responseErrors);
      alert("There were some errors in the response.");
    } else {
      var response = Response.findOneById(responseID);
      response.update(status, answersData);
      self.fireEvent('ResponsesEditView:savedResponse');
      Ti.API.info("should have fired event here");
    }
  };

  var actionButtonsView = Ti.UI.createView({
    layout : 'horizontal',
    top : 10,
    left : '2%',
    width : '100%'
  });
  var saveButton = Ti.UI.createButton({
    title : 'Save',
    width : '48%'
  });
  actionButtonsView.add(saveButton);

  var completeButton = Ti.UI.createButton({
    title : 'Complete',
    width : '48%'
  });
  actionButtonsView.add(completeButton);
  self.add(saveButton);
  self.add(completeButton);

  completeButton.addEventListener('click', function(event) {
    validateAndUpdateAnswers(event, "complete");
  });
  saveButton.addEventListener('click', function(event) {
    validateAndUpdateAnswers(event, "incomplete");
  });

  return self;
}

module.exports = ResponseEditView;
