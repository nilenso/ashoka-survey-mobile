//DateQuestionView Component Constructor
function DateQuestionView(question, content) {

	var self = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		value : content ? new Date(content) : new Date(),
		color : '#336699',
		right : 5,
		left : 5,
	});
	
	self.getValue = function() {
		var val = self.value;
		return val.getFullYear() + '/' + (val.getMonth() + 1) + '/' + val.getDate()
	};

	return self;
}

module.exports = DateQuestionView;
