function ResponsesNewWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')

	var self = Ti.UI.createWindow({
		title : 'New Response',
		backgroundColor : "#fff"
	});
	self.add(new ResponsesNewView(surveyID));
	
	Ti.App.addEventListener('ResponsesNewView:savedResponse', function() {
		navGroup.close(self);
	})
	
	return self;
}

module.exports = ResponsesNewWindow; 