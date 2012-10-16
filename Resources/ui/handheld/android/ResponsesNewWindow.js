function ResponsesNewWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')

	self = Ti.UI.createWindow({
		title : 'New Response',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	view = new ResponsesNewView(surveyID);
	self.add(view);
	
	view.addEventListener('ResponsesNewView:savedResponse', function() {
		self.close();
	})
	
	return self;
}

module.exports = ResponsesNewWindow; 