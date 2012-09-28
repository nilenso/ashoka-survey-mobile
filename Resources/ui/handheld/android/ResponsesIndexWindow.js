function ResponsesIndexWindow(surveyID) {
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow')
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
					Survey.syncResponses(surveyID);
				});
				menuItemSync.setIcon("images/refresh.png");
			}
		}
	});
	self.add(new ResponsesIndexView(surveyID));

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
		ResponseShowWindow(e.responseID).open();
	});
	
	var syncSuccessHandler = function() {
		alert("successfully uploaded responses!");
		Ti.App.removeEventListener("syncResponses.success", syncSuccessHandler);
	};
	
	Ti.App.addEventListener("syncResponses.success", syncSuccessHandler);
	
	var syncErrorHandler = function() {
		alert("error in uploading responses!");
		Ti.App.removeEventListener("syncResponses.error", syncErrorHandler);
	};
	
	Ti.App.addEventListener("syncResponses.error", syncErrorHandler);

	return self;
}

module.exports = ResponsesIndexWindow;
