//SettingsView Component Constructor
function SettingsView() {
	self = Ti.UI.createView({
		layout : 'vertical'
	});

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : 'Server location',
		height : 'auto',
		width : 'auto',
		left : 5
	});
	self.add(label);

	var textField = Ti.UI.createTextField({
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		right : 5,
		left : 5,
		value : Ti.App.Properties.getString('server_url')
	});
	self.add(textField);

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		width : '100%'
	});
	self.add(saveButton);
	saveButton.addEventListener('click', function(e) {
		var server_url = textField.getValue();
		if (server_url.match(/^https?\:\/\/[\w-.]+(\.\w{2,4}|\:\d{2,5})$/i) == null) {
			alert("Your settings are invalid. Please check them before saving.");
		} else {
			Ti.App.Properties.setString('server_url', server_url);
			Ti.App.fireEvent('settings_saved');
		}
	});

	return self;
}

module.exports = SettingsView;
