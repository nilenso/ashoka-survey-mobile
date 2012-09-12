//SettingsView Component Constructor
function SettingsView() {
	self = Ti.UI.createView({layout: 'vertical'});

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : 'Server location',
		height : 'auto',
		width : 'auto',
		left: 5
	});
	self.add(label);

	var textField = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		right: 5,
		left: 5,
		value: 'http://survey-web-staging.herokuapp.com/'		
	});
	self.add(textField);

	return self;
}

module.exports = SettingsView; 