//All the questoin in a survey
function ResponseEditView(responseID) {
  var _ = require('lib/underscore')._;
  var Question = require('models/question');
  var Answer = require('models/answer');
  var Response = require('models/response');
  var Survey = require('models/survey');
  var QuestionView = require('ui/common/questions/QuestionView');
  var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
  var responseViewHelper = new ResponseViewHelper;

  var self = Ti.UI.createScrollView({
    layout : 'vertical'
  });
  
  var response = Response.findOneById(responseID);
  var survey = Survey.findOneById(response.survey_id);
  var questions = survey.firstLevelQuestions();
  _(questions).each(function(question) {
    var answer = response.answerForQuestion(question.id); 
    var questionView = new QuestionView(question, answer);
    self.add(questionView);
  });

  var validateAndUpdateAnswers = function(e, status) {
    var questionViews = responseViewHelper.getQuestionViews(self);
    var answersData = _(questionViews).map(function(fields, questionID) {
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
      responseViewHelper.displayErrors(responseErrors, questionViews);
      alert("There were some errors in the response.");
    } else {
      var response = Response.findOneById(responseID);
      response.update(status, answersData);
      self.fireEvent('ResponsesEditView:savedResponse');
    }
  };


  var saveButton = Ti.UI.createButton({
    title : 'Save',
    width : '48%'
  });

  var completeButton = Ti.UI.createButton({
    title : 'Complete',
    width : '48%'
  });
 
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
