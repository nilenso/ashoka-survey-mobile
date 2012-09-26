//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView')
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')
	var Survey = require('models/survey');

	var mainAppWindow = Ti.UI.createWindow({
		title : 'Surveys'
	});
	var surveysIndexView = new SurveysIndexView();
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
		Survey.fetchSurveys();
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
		var surveyDetailsWindow = Ti.UI.createWindow({
			title : 'Survey Details'
		});
		surveyDetailsWindow.add(new SurveyDetailsView(e.surveyID));
		navGroup.open(surveyDetailsWindow);
	});

	var createResponseWindow;

	Ti.App.addEventListener('SurveyDetailsView:createResponse', function(e) {
		createResponseWindow = Ti.UI.createWindow({
			title : 'Add a Response',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		createResponseWindow.add(new ResponsesNewView(e.surveyID));
		navGroup.open(createResponseWindow);
	})

	Ti.App.addEventListener('SurveyDetailsView:responsesIndex', function() {

	})

	Ti.App.addEventListener('ResponsesNewView:savedResponse', function() {
		navGroup.close(createResponseWindow);
	})

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
