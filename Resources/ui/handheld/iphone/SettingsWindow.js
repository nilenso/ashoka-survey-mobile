function SettingsWindow() {
	var SettingsView = require('ui/common/SettingsView');
	
	var self = Ti.UI.createWindow({
		title : 'Settings',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	
	var settingsView = new SettingsView();
	self.add(settingsView);
	
	Ti.App.addEventListener('settings_saved', function() {
		navGroup.close(self);
	})
	
	return self;
}

module.exports = SettingsWindow;