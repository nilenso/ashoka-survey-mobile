//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView');
	var Survey = require('models/survey');
	var SurveyShowView = require('ui/common/SurveyShowView')

	var surveyModel = new Survey();

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
				var menuItemRefresh = menu.add({
					title : "Refresh"
				});
				menuItemRefresh.addEventListener('click', function() {
					surveyModel.fetch();
				});
				//menuItemRefresh.setIcon("images/refresh.png");
				var menuItemSettings = menu.add({
					title : "Settings"
				});
				menuItemSettings.addEventListener('click', function() {
					settingsWindow.open();
				});
				//menuItemSettings.setIcon("images/gear.png");
			}
		}
	});

	Ti.App.addEventListener('settings_saved', function() {
		settingsWindow.close();
	})

	Ti.App.addEventListener('surveys_index_view.table_row_clicked', function(e) {
		var surveyShowWindow = Ti.UI.createWindow({
			title : 'Survey Details',
			navBarHidden : false,
			backgroundColor : "#fff"
		});
		surveyShowWindow.add(new SurveyShowView(surveyModel, e.surveyID));
		surveyShowWindow.open();
	});

	//construct UI
	var surveysIndexView = new SurveysIndexView(surveyModel);
	self.add(surveysIndexView);

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
