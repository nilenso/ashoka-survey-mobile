var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');
//BasicQuestionView Component Constructor
function BasicQuestionView(question, content, hintText) {

	var props = {
		borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		right : 5,
		left : 5,
		editable : true,
		hintText : hintText,
		font : {
			fontSize : Measurements.FONT_MEDIUM
		}
	};

	if (question.type == 'NumericQuestion')
		props['keyboardType'] = Ti.UI.KEYBOARD_NUMBER_PAD;
	else if (question.type == 'MultilineQuestion')
		props['height'] = Ti.Platform.displayCaps.platformHeight * 0.25;

	if (content) props['value'] = content;

	var self = Ti.UI.createTextField(props);
	
	self.getSubQuestions = function() {
    return null;
  }
	
	return self;
}

module.exports = BasicQuestionView;
