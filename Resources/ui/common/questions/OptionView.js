//OptionView Component Constructor
function OptionView(option) {
	var self = Ti.UI.createTableViewRow();

	var size = Ti.Platform.displayCaps.platformHeight * 0.05
	var checkBox = Ti.UI.createWebView({
		url : '/templates/checkbox.html',
		height : '30dp',
		showScrollbars : false,
		width : '30dp',
		enableZoomControls : false,
		disableBounce: true
	});
	self.add(checkBox);

	var label = Ti.UI.createLabel({
		color : '#000000',
		text : option.content,
		height : 'auto',
		width : 'auto',
		left : size * 1.5
	});

	self.add(label);

	return self;
}

module.exports = OptionView;
