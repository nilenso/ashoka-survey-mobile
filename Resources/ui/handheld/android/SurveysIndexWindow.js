//Application Window Component Constructor
function SurveysIndexWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
	var SettingsWindow = require('ui/handheld/android/SettingsWindow');
	var Survey = require('models/survey');
	var Question = require('models/question');
	var SurveyDetailsWindow = require('ui/handheld/android/SurveyDetailsWindow');
	var settingsWindow = SettingsWindow(); 

	var surveysIndexView = new SurveysIndexView();
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
					title : "Fetch Surveys"
				});
				menuItemSync.addEventListener('click', function() {
					Survey.fetchSurveys();
					surveysIndexView.addErrorListener();
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

	surveysIndexView.addEventListener('surveys_index_view.table_row_clicked', function(e) {
		SurveyDetailsWindow(e.surveyID).open();
	});

	//construct UI
	self.add(surveysIndexView);

	return self;
}

//make constructor function the public component interface
module.exports = SurveysIndexWindow;
