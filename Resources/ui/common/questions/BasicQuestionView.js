//BasicQuestionView Component Constructor
function BasicQuestionView(question, content) {

	var props = {
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		color : '#336699',
		right : 5,
		left : 5,
		editable : true
	};

	if (question.type == 'NumericQuestion')
		props['keyboardType'] = Ti.UI.KEYBOARD_NUMBER_PAD;
	else if (question.type == 'MultilineQuestion')
		props['height'] = Ti.Platform.displayCaps.platformHeight * 0.25;
		
	if (content) props['value'] = content;

	var self = Ti.UI.createTextField(props);
	return self;
}

module.exports = BasicQuestionView;
