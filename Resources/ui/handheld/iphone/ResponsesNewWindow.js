function ResponsesNewWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')

	var self = Ti.UI.createWindow({
		title : 'New Response',
		backgroundColor : "#fff"
	});
	var view = new ResponsesNewView(surveyID); 
	self.add(view);
	view.addEventListener('ResponsesNewView:savedResponse', function() {
		navGroup.close(self);
	})
	
	return self;
}

module.exports = ResponsesNewWindow; 