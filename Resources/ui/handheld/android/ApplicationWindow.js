//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
	var SettingsView = require('ui/common/SettingsView')

		
	
	//create component instance
	var self = Ti.UI.createWindow({
		title: 'Surveys',
		backgroundColor:'#fff',
		navBarHidden:false,
		exitOnClose:true,
		activity: {
			onCreateOptionsMenu: function(e) {
			    var menu = e.menu;
			    var menuItemRefresh = menu.add({ title: "Refresh" });
			    menuItemRefresh.addEventListener('click', function(){
			    	alert("Clicked on refresh!");
			    });
			    //menuItemRefresh.setIcon("images/refresh.png");
			    var menuItemSettings = menu.add({ title: "Settings" });
			    menuItemSettings.addEventListener('click', function(){
			    	  var settingsWindow = Ti.UI.createWindow({ 
			    	  	title: 'Settings',
			    	  	navBarHidden: false,
			    	  	backgroundColor: "#fff"
			    	  });
							var settingsView = new SettingsView();
							settingsWindow.add(settingsView);
			    		settingsWindow.open();
			    });
			    //menuItemSettings.setIcon("images/gear.png");
			}
		}
	});
		
	//construct UI
	var surveysIndexView = new SurveysIndexView();
	self.add(surveysIndexView);
	
	return self;
}

//make constructor function the public component interface
module.exports = ApplicationWindow;
