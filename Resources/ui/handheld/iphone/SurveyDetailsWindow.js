function SurveyDetailsWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewWindow = require('ui/handheld/iphone/ResponsesNewWindow')
	var ResponsesIndexWindow = require('ui/handheld/iphone/ResponsesIndexWindow')

	var self = Ti.UI.createWindow({
		title : 'Survey Details',
		backgroundColor : "#fff"

	});
	self.add(new SurveyDetailsView(surveyID));

	var createResponseCallback = function(e) {
		navGroup.open(new ResponsesNewWindow(e.surveyID));
	}

	Ti.App.addEventListener('SurveyDetailsView:createResponse', createResponseCallback)

	var responseIndexCallback = function(e) {
		navGroup.open(new ResponsesIndexWindow(e.surveyID));
	}

	Ti.App.addEventListener('SurveyDetailsView:responsesIndex', responseIndexCallback);

	self.addEventListener('close', function() {
		Ti.App.removeEventListener('SurveyDetailsView:createResponse', createResponseCallback)
		Ti.App.removeEventListener('SurveyDetailsView:responsesIndex', responseIndexCallback)
	})

	return self;
}

module.exports = SurveyDetailsWindow;
