function ResponseEditWindow(responseID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseEditView = require('ui/common/responses/ResponseEditView')

	var self = Ti.UI.createWindow({
		title : 'Edit Response',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	view = new ResponseEditView(responseID);
	self.add(view);
	
	view.addEventListener('ResponsesEditView:savedResponse', function() {
		self.close();
	});
	
	return self;
}

module.exports = ResponseEditWindow;