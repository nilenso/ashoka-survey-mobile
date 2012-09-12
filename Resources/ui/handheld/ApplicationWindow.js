//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#ff0000'
	});
		
	var mainAppWindow = Ti.UI.createWindow({
		title: 'Surveys'
	});
	var refreshButton = Ti.UI.createButton({
		systemButton: Ti.UI.iPhone.SystemButton.REFRESH
	});
	mainAppWindow.rightNavButton = refreshButton;

	var settingsButton = Ti.UI.createButton({
		title: 'Settings'
	});
	mainAppWindow.leftNavButton = settingsButton;
	
	
	var navGroup = Ti.UI.iPhone.createNavigationGroup({
		window: mainAppWindow
	});
	self.add(navGroup);
	
	// construct UI
	var surveysIndexView = new SurveysIndexView();
	self.add(surveysIndexView);

	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
