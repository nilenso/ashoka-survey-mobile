function SurveyDetailsWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewWindow = require('ui/handheld/android/ResponsesNewWindow')
	var ResponsesIndexWindow = require('ui/handheld/android/ResponsesIndexWindow')

	var self = Ti.UI.createWindow({
		title : 'Survey Details',
		navBarHidden : true,
		backgroundColor : "#fff"
	});
	var view = new SurveyDetailsView(surveyID);
	self.add(view);

	view.addEventListener('SurveyDetailsView:createResponse', function(e) {
		new ResponsesNewWindow(e.surveyID).open();
	})

	view.addEventListener('SurveyDetailsView:responsesIndex', function(e) {
		new ResponsesIndexWindow(e.surveyID).open(); 
	})

	return self;
}

module.exports = SurveyDetailsWindow; 