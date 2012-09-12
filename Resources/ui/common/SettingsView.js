//SettingsView Component Constructor
function SettingsView() {
	self = Ti.UI.createView();
	
	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color:'#000000',
		text: 'This is the settings pane!',
		height:'auto',
		width:'auto'
	});
	self.add(label);
	
	return self;
}

module.exports = SettingsView;