//Application Window Component Constructor
function ApplicationWindow() {
	//load component dependencies
	var SurveysIndexView = require('ui/common/SurveysIndexView');
		
	//create component instance
	var self = Ti.UI.createWindow({
		title: 'Surveys',
		backgroundColor:'#ff0000',
		navBarHidden:false,
		exitOnClose:true,
		activity: {
			onCreateOptionsMenu: function(e) {
			    var menu = e.menu;
			    var menuItemRefresh = menu.add({ title: "Refresh" });
			    //menuItemRefresh.setIcon("images/refresh.png");
			    var menuItemSettings = menu.add({ title: "Settings" });
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
