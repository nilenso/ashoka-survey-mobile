//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView')
	
	var mainAppWindow = Ti.UI.createWindow({ title: 'Surveys' });
	var surveysIndexView = new SurveysIndexView();
	mainAppWindow.add(surveysIndexView);

	var settingsWindow = Ti.UI.createWindow({ title: 'Settings' });
	var settingsView = new SettingsView();
	settingsWindow.add(settingsView);
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff'
	});

	var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });
	refreshButton.addEventListener('click', function(e){
		alert("You clicked the button");
	});
	mainAppWindow.rightNavButton = refreshButton;

	var settingsButton = Ti.UI.createButton({ title: 'Settings' });		
	settingsButton.addEventListener('click', function(e){
		navGroup.open(settingsWindow);
	});
	mainAppWindow.leftNavButton = settingsButton;
	
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: mainAppWindow
	});
	self.add(navGroup);
	
	Ti.App.addEventListener('settings_saved', function(){
		navGroup.close(settingsWindow);
	})
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
