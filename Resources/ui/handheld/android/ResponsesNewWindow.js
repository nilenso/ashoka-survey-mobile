function ResponsesNewWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')

	self = Ti.UI.createWindow({
		title : 'New Response',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	self.add(new ResponsesNewView(surveyID));
	
	Ti.App.addEventListener('ResponsesNewView:savedResponse', function() {
		self.close();
	})
	
	return self;
}

module.exports = ResponsesNewWindow; 