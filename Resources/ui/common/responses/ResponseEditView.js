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
  var ButtonView = require('ui/common/components/ButtonView');
  var Toast = require('ui/common/components/Toast');

  var self = new TopLevelView('Edit Response');
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
		var answersData = _(questionViews).map(function(questionView, questionID) {
			Ti.API.info("questionid:" + questionID);
			Ti.API.info("content:" + questionView.getValueField().getValue());
			return {
				'id' : questionView.answerID,
				'question_id' : questionID,
				'content' : questionView.getValueField().getValue()
			};
		});
		responseErrors = Response.validate(answersData, status);
		if (!_.isEmpty(responseErrors)) {
			responseViewHelper.displayErrors(responseErrors, questionViews);
			responseViewHelper.scrollToFirstErrorPage(scrollableView, responseErrors);
			(new Toast('There were some errors in the response.')).show();
		} else {
			var response = Response.findOneById(responseID);
			response.update(status, answersData);
			(new Toast('Response saved')).show();
			self.fireEvent('ResponsesEditView:savedResponse');
		}
		activityIndicator.hide();
	};

  responseViewHelper.paginate(questions, scrollableView,response, validateAndUpdateAnswers);

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : 'Saving...',
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

	return self;
}

module.exports = ResponseEditView;
