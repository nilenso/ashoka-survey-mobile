function ResponsesIndexWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseShowWindow = require('ui/handheld/iphone/ResponseShowWindow')
	var Survey = require('models/survey');

	var self = Ti.UI.createWindow({
		title : 'All Responses',
		backgroundColor : "#fff"
	});
	self.add(new ResponsesIndexView(surveyID));

	var tableRowClickedCallback = function(e) {
		navGroup.open(new ResponseShowWindow(e.responseID));
	}
	var syncButton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.REFRESH
	});
	syncButton.addEventListener('click', function(e) {
		var survey = Survey.findOneById(surveyID);
		survey.syncResponses();
	});
	self.rightNavButton = syncButton;

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', tableRowClickedCallback);

	var syncHandler = function(data) {
		Ti.App.removeEventListener("survey.responses.sync", syncHandler);
		navGroup.close(self);
		alert("successes: " + (data.successes || 0) + "\nerrors: " + (data.errors || 0));
	};
	Ti.App.addEventListener("survey.responses.sync", syncHandler);

	self.addEventListener('close', function() {
		Ti.App.removeEventListener('ResponsesIndexView:table_row_clicked', tableRowClickedCallback)
		Ti.App.removeEventListener("survey.responses.sync", syncHandler);
	});

	return self;
}

module.exports = ResponsesIndexWindow;
