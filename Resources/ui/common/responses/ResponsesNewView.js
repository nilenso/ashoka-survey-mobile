//All the questoin in a survey
function ResponsesNewView(surveyID) {
  var _ = require('lib/underscore')._;
  var Question = require('models/question');
  var Survey = require('models/survey');
  var Response = require('models/response');
  var QuestionView = require('ui/common/questions/QuestionView');
  var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
  var responseViewHelper = new ResponseViewHelper;

  var self = Ti.UI.createScrollView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var survey = Survey.findOneById(surveyID);
  var questions = survey.firstLevelQuestions();
  _(questions).each(function(question) {
    var questionView = new QuestionView(question);
    self.add(questionView);
  });

  var validateAndSaveAnswers = function(e, status) {
    var questionViews = responseViewHelper.getQuestionViews(self);
    var answersData = _(questionViews).map(function(fields, questionID) {
      Ti.API.info("questionid:" + questionID);
      Ti.API.info("content:" + fields['valueField'].getValue());
      return {
        'question_id' : questionID,
        'content' : fields.valueField.getValue()
      }
    });
    responseErrors = Response.validate(answersData, status);
    if (!_.isEmpty(responseErrors)) {
      responseViewHelper.displayErrors(responseErrors, questionViews);
      alert("There were some errors in the response.");
    } else {
      Response.createRecord(surveyID, status, answersData);
      self.fireEvent('ResponsesNewView:savedResponse');
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
    validateAndSaveAnswers(event, "complete");
  });
  saveButton.addEventListener('click', function(event) {
    validateAndSaveAnswers(event, "incomplete");
  });

  return self;
}

module.exports = ResponsesNewView;
