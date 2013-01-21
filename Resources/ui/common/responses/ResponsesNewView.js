//All the questoin in a survey
function ResponsesNewView(surveyID) {
  var _ = require('lib/underscore')._;
  var Question = require('models/question');
  var Survey = require('models/survey');
  var Response = require('models/response');
  var QuestionView = require('ui/common/questions/QuestionView');
  var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var responseViewHelper = new ResponseViewHelper();
  var Toast = require('ui/common/components/Toast');

  var self = new TopLevelView('New Response');

  var scrollableView = Ti.UI.createScrollableView({
    top : self.headerHeight,
    showPagingControl : true
  });
  self.add(scrollableView);

  var survey = Survey.findOneById(surveyID);
  var questions = survey.firstLevelQuestionsAndCategories();

  var validateAndSaveAnswers = function(e, status) {
    activityIndicator.show();
    var questionViews = responseViewHelper.getQuestionViews(scrollableView.getViews());
    var answersData = _(questionViews).map(function(questionView, questionID) {
      Ti.API.info("questionid:" + questionID);
      Ti.API.info("content:" + questionView.getValueField().getValue());
      return {
        'question_id' : questionID,
        'content' : questionView.getValueField().getValue()
      };
    });
    var responseErrors = Response.validate(answersData, status);
    if (!_.isEmpty(responseErrors)) {
      responseViewHelper.displayErrors(responseErrors, questionViews);
      pagesWithErrors = responseViewHelper.scrollToFirstErrorPage(scrollableView, responseErrors);
      pagesWithErrors = _(pagesWithErrors).map(function(pageNumber) {
        return pageNumber + 1 ;
      });
      alert("There were errors in page(s) " + _(pagesWithErrors).uniq().toString());
    } else {
      Response.createRecord(surveyID, status, answersData, responseLocation);
      new Toast('Response saved').show();
      self.fireEvent('ResponsesNewView:savedResponse');
    }
    activityIndicator.hide();
  };

  responseViewHelper.paginate(questions, scrollableView, null, validateAndSaveAnswers);

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : L('saving_response'),
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

  var getCurrentLocation = function() {
    var location = {};
    Titanium.Geolocation.getCurrentPosition(function(e) {
      if (e.error) {
        Ti.API.info("Error getting location");
        return;
      }
      location.longitude = e.coords.longitude;
      location.latitude = e.coords.latitude;
      Ti.API.info("longitude = " + e.coords.longitude);
      Ti.API.info("latitude = " + e.coords.latitude);
    });
    return location;
  };

  var responseLocation = getCurrentLocation();

  self.cleanup = function() {
    self.remove(scrollableView);
    scrollableView = null;
  };
  return self;
}

module.exports = ResponsesNewView;
