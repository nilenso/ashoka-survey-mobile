//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView')
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff'
	});
		
	var mainAppWindow = Ti.UI.createWindow({ title: 'Surveys' });
	
	var refreshButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.REFRESH });
	refreshButton.addEventListener('click', function(e){
		alert("You clicked refresh");
	});
	mainAppWindow.rightNavButton = refreshButton;

	var settingsButton = Ti.UI.createButton({ title: 'Settings' });		
	settingsButton.addEventListener('click', function(e){
		alert("You clicked settings");
	});
	mainAppWindow.leftNavButton = settingsButton;

	var surveysIndexView = new SurveysIndexView();
	mainAppWindow.add(surveysIndexView);
	
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: mainAppWindow
	});
	self.add(navGroup);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
