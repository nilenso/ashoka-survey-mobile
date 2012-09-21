//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView')
	var SurveyShowView = require('ui/common/surveys/SurveyShowView')
	var surveyModel = require('models/survey');

	var mainAppWindow = Ti.UI.createWindow({
		title : 'Surveys'
	});
	var surveysIndexView = new SurveysIndexView(surveyModel);
	mainAppWindow.add(surveysIndexView);

	var settingsWindow = Ti.UI.createWindow({
		title : 'Settings'
	});
	var settingsView = new SettingsView();
	settingsWindow.add(settingsView);

	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor : '#fff'
	});

	var syncButton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.REFRESH
	});
	syncButton.addEventListener('click', function(e) {
		surveyModel.fetch();
	});
	mainAppWindow.rightNavButton = syncButton;

	var settingsButton = Ti.UI.createButton({
		title : 'Settings'
	});
	settingsButton.addEventListener('click', function(e) {
		navGroup.open(settingsWindow);
	});
	mainAppWindow.leftNavButton = settingsButton;

	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window : mainAppWindow
	});
	self.add(navGroup);

	Ti.App.addEventListener('settings_saved', function() {
		navGroup.close(settingsWindow);
	})

	Ti.App.addEventListener('surveys_index_view.table_row_clicked', function(e) {
		var surveyShowWindow = Ti.UI.createWindow({
			title : 'Survey Details'
		});
		surveyShowWindow.add(new SurveyShowView(surveyModel, e.surveyID));
		navGroup.open(surveyShowWindow);
	});

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
