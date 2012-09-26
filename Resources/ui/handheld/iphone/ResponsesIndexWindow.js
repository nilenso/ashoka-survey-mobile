function ResponsesIndexWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseShowWindow = require('ui/handheld/iphone/ResponseShowWindow')

	var self = Ti.UI.createWindow({
		title : 'All Responses',
		backgroundColor : "#fff"
	});
	self.add(new ResponsesIndexView(surveyID));
	
	var tableRowClickedCallback = function(e) {
		navGroup.open(new ResponseShowWindow(e.responseID));
	}

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', tableRowClickedCallback);
	
	self.addEventListener('close', function() {
		Ti.App.removeEventListener('ResponsesIndexView:table_row_clicked', tableRowClickedCallback)
	})

	return self;
}

module.exports = ResponsesIndexWindow;
