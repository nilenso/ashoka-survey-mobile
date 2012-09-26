function SurveysIndexWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
	var SettingsWindow = require('ui/handheld/iphone/SettingsWindow')
	var SurveyDetailsWindow = require('ui/handheld/iphone/SurveyDetailsWindow')
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView')
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var Survey = require('models/survey');

	var self = Ti.UI.createWindow({
		title : 'Surveys'
	});

	var surveysIndexView = new SurveysIndexView();
	self.add(surveysIndexView);

	var syncButton = Ti.UI.createButton({
		systemButton : Ti.UI.iPhone.SystemButton.REFRESH
	});
	syncButton.addEventListener('click', function(e) {
		Survey.fetchSurveys();
	});
	self.rightNavButton = syncButton;

	var settingsButton = Ti.UI.createButton({
		title : 'Settings'
	});
	settingsButton.addEventListener('click', function(e) {
		navGroup.open(new SettingsWindow());
	});
	self.leftNavButton = settingsButton;

	Ti.App.addEventListener('surveys_index_view.table_row_clicked', function(e) {
		navGroup.open(new SurveyDetailsWindow(e.surveyID));
	});

	return self;
}

//make constructor function the public component interface
module.exports = SurveysIndexWindow;
