function SurveyDetailsWindow(surveyID) {
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
	var ResponsesNewWindow = require('ui/handheld/iphone/ResponsesNewWindow');
	var ResponsesIndexWindow = require('ui/handheld/iphone/ResponsesIndexWindow');

	var self = Ti.UI.createWindow({
		title : 'Survey Details',
		backgroundColor : "#fff"

	});
	var view = new SurveyDetailsView(surveyID);
	self.add(view);

	var createResponseCallback = function(e) {
		navGroup.open(new ResponsesNewWindow(e.surveyID));
	};

	view.addEventListener('SurveyDetailsView:createResponse', createResponseCallback);

	Ti.App.addEventListener('ResponseEditWindow:closed', view.refresh);

	var responseIndexCallback = function(e) {
		navGroup.open(new ResponsesIndexWindow(e.surveyID));
	};

	view.addEventListener('SurveyDetailsView:responsesIndex', responseIndexCallback);

self.addEventListener('android:back', function() {
    Ti.App.removeEventListener('ResponseEditWindow:closed', view.refresh);
    self.close();
  });

	return self;
}

module.exports = SurveyDetailsWindow;
