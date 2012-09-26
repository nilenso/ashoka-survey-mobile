//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView');
	var Survey = require('models/survey');
	var Question = require('models/question');
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')

	var settingsWindow = Ti.UI.createWindow({
		title : 'Settings',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	var settingsView = new SettingsView();
	settingsWindow.add(settingsView);

	//create component instance
	var self = Ti.UI.createWindow({
		title : 'Surveys',
		backgroundColor : '#fff',
		navBarHidden : false,
		exitOnClose : true,
		activity : {
			onCreateOptionsMenu : function(e) {
				var menu = e.menu;
				var menuItemSync = menu.add({
					title : "Sync"
				});
				menuItemSync.addEventListener('click', function() {
					Survey.fetchSurveys();
				});
				menuItemSync.setIcon("images/refresh.png");
				var menuItemSettings = menu.add({
					title : "Settings"
				});
				menuItemSettings.addEventListener('click', function() {
					settingsWindow.open();
				});
				menuItemSettings.setIcon("images/settings.png");
			}
		}
	});

	Ti.App.addEventListener('settings_saved', function() {
		settingsWindow.close();
	})

	Ti.App.addEventListener('surveys_index_view.table_row_clicked', function(e) {
		var surveyDetailsWindow = Ti.UI.createWindow({
			title : 'Survey Details',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		surveyDetailsWindow.add(new SurveyDetailsView(e.surveyID));
		surveyDetailsWindow.open();
	});

	var createResponseWindow;
	Ti.App.addEventListener('SurveyDetailsView:createResponse', function(e) {
		createResponseWindow = Ti.UI.createWindow({
			title : 'Add a Response',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		createResponseWindow.add(new ResponsesNewView(e.surveyID));
		createResponseWindow.open();
	})

	Ti.App.addEventListener('SurveyDetailsView:responsesIndex', function(e) {
		responsesIndexWindow = Ti.UI.createWindow({
			title : 'Add a Response',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		responsesIndexWindow.add(new ResponsesIndexView(e.surveyID));
		responsesIndexWindow.open();
	})

	Ti.App.addEventListener('ResponsesNewView:savedResponse', function() {
		createResponseWindow.close();
	})

	Ti.App.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
		responseShowWindow = Ti.UI.createWindow({
			title : 'Add a Response',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		responseShowWindow.add(new ResponseShowView(e.responseID));
		responseShowWindow.open();
	})
	//construct UI
	var surveysIndexView = new SurveysIndexView();
	self.add(surveysIndexView);

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
