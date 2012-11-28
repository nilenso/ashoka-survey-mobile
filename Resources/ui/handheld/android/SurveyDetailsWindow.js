function SurveyDetailsWindow(surveyID) {
  var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
  var ResponsesNewWindow = require('ui/handheld/android/ResponsesNewWindow')
  var ResponsesIndexWindow = require('ui/handheld/android/ResponsesIndexWindow')

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });
  var view = new SurveyDetailsView(surveyID);
  self.add(view);

  var activityIndicator = Ti.UI.createActivityIndicator({
    message : 'Loading...',
  });
  self.add(activityIndicator);

  view.addEventListener('SurveyDetailsView:createResponse', function(e) {
    activityIndicator.show();
    new ResponsesNewWindow(e.surveyID).open();
    activityIndicator.hide();
  });

  view.addEventListener('SurveyDetailsView:responsesIndex', function(e) {
    activityIndicator.show();
    new ResponsesIndexWindow(e.surveyID).open();
    activityIndicator.hide();
  });

  return self;
}

module.exports = SurveyDetailsWindow;
