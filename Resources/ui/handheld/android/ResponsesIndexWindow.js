function ResponsesIndexWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow')

	self = Ti.UI.createWindow({
		title : 'All Responses',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	self.add(new ResponsesIndexView(surveyID));

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
		ResponseShowWindow(e.responseID).open();
	})

	return self;
}

module.exports = ResponsesIndexWindow;
