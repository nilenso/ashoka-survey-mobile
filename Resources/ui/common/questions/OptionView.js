//OptionView Component Constructor
function OptionView(option) {
	var self = Ti.UI.createTableViewRow();

	var size = Ti.Platform.displayCaps.platformHeight * 0.05
	var checkBox = Ti.UI.createImageView({
		height : size,
		width : size,
		left : 5,
		backgroundColor : 'white',
		borderColor : '#666',
		borderWidth : 2,
		borderRadius : 5,
		isChecked : false
	});
	self.add(checkBox);

	var label = Ti.UI.createLabel({
		color : '#000000',
		text : option.content,
		height : 'auto',
		width : 'auto',
		left : size * 1.5
	});

	checkBox.addEventListener('click', function(e) {
		Ti.API.info("status:" + e.source.isChecked);
		if (e.source.isChecked == false) {
			Ti.API.info(e.source);
			e.source.backgroundColor = '#666';
			e.source.isChecked = true;
		} else {
			e.source.backgroundColor = 'white';
			e.source.isChecked = false;
		}
	});

	self.add(label);
	return self;
}

module.exports = OptionView;
