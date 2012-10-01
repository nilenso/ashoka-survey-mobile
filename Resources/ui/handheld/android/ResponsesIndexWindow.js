function ResponsesIndexWindow(surveyID) {
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow')
	var SurveyDetailsWindow = require('ui/handheld/android/SurveyDetailsWindow')
	var Survey = require('models/survey')

	self = Ti.UI.createWindow({
		title : 'All Responses',
		navBarHidden : false,
		backgroundColor : "#fff",
		
		activity : {
			onCreateOptionsMenu : function(e) {
				var menu = e.menu;
				var menuItemSync = menu.add({
					title : "Sync"
				});
				menuItemSync.addEventListener('click', function() {
					survey = Survey.findOneById(surveyID)
					survey.syncResponses();
				});
				menuItemSync.setIcon("images/refresh.png");
			}
		}
	});
	self.add(new ResponsesIndexView(surveyID));

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
		new ResponseShowWindow(e.responseID).open();
	});
	
	var syncSuccessHandler = function() {
		Ti.App.removeEventListener("survey.responses.sync.success", syncSuccessHandler);
		self.close();
		alert("successfully uploaded responses!");
	};
	
	Ti.App.addEventListener("survey.responses.sync.success", syncSuccessHandler);
	
	var syncErrorHandler = function() {
		Ti.App.removeEventListener("survey.responses.sync.error", syncErrorHandler);
		self.close();
		alert("error in uploading responses!");
	};
	
	Ti.App.addEventListener("survey.responses.sync.error", syncErrorHandler);

	return self;
}

module.exports = ResponsesIndexWindow;
