//A single survey
function SurveyShowView() {

	self = Ti.UI.createView({
		layout : 'vertical'
	});
	
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : 'Nothing here yet.',
		height : 'auto',
		width : 'auto',
		left : 5
	});
	self.add(label);

	return self;
}

module.exports = SurveyShowView;
