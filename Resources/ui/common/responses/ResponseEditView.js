//All the questoin in a survey
function ResponseEditView(responseID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Answer = require('models/answer');
	var Response = require('models/response');
	var Survey = require('models/survey');
	var QuestionView = require('ui/common/questions/QuestionView');
	var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
  var TopLevelView = require('ui/common/components/TopLevelView');
	var responseViewHelper = new ResponseViewHelper();
  var Toast = require('ui/common/components/Toast');

  var self = new TopLevelView(L('edit_response'));
  var scrollableView = Ti.UI.createScrollableView({
    top : self.headerHeight,
    showPagingControl : true
  });
  self.add(scrollableView);

	var response = Response.findOneById(responseID);
	var survey = Survey.findOneById(response.survey_id);
	var questions = survey.firstLevelQuestionsAndCategories();

  var validateAndUpdateAnswers = function(e, status) {
    activityIndicator.show();
		var questionViews = responseViewHelper.getQuestionViews(scrollableView.getViews());
		var answersData = _(questionViews).map(function(questionView) {
			Ti.API.info("questionid:" + questionView.id);
			Ti.API.info("content:" + questionView.getValueField().getValue());
			return {
				'id' : questionView.answerID,
				'question_id' : questionView.id,
        'content' : questionView.getValueField().getValue(),
        'record_id' : questionView.recordID
			};
		});
		var responseErrors = Response.validate(answersData, status);
    if (!_.isEmpty(responseErrors)) {
      responseViewHelper.displayErrors(responseErrors, questionViews);
      pagesWithErrors = responseViewHelper.scrollToFirstErrorPage(scrollableView, responseErrors);
      pagesWithErrors = _(pagesWithErrors).map(function(pageNumber) {
        return pageNumber + 1 ;
      });
      alert(L("errors_on_pages") + _(pagesWithErrors).uniq().toString());
    } else {
      var response = Response.findOneById(responseID);
      response.update(status, answersData);
			Toast('Response saved').show();
      self.fireEvent('ResponsesEditView:savedResponse');
    }
		activityIndicator.hide();
	};

  var questionViews = [];
  var questionNumber = 1;
  _(questions).each(function(question, number) {
    var answer = response.answerForQuestion(question.id);
    var questionView = new QuestionView(question, answer, response, questionNumber++);
    questionViews.push(questionView);
  });

  var subQuestionIndicator = Ti.UI.Android.createProgressIndicator({
    message : L('loading_sub_questions'),
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });

  var paginate = function(){
    subQuestionIndicator.show();
    responseViewHelper.paginate(questionViews, scrollableView, response, validateAndUpdateAnswers);
    subQuestionIndicator.hide();
  };

  Ti.App.addEventListener('show.sub.questions', paginate);

  responseViewHelper.paginate(questionViews, scrollableView, response, validateAndUpdateAnswers);

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : L('saving_response'),
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

  self.cleanup = function() {
    Ti.App.removeEventListener('show.sub.questions', paginate);
    self.remove(scrollableView);
  };

	return self;
}

module.exports = ResponseEditView;
