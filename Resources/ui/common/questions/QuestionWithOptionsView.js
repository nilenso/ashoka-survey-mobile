//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
function QuestionWithOptionsView(question) {

	self = Ti.UI.createPicker({
		color : '#336699',
		right : 5,
		left : 5
	});

	var data = [];

	data.push(Ti.UI.createPickerRow({
		title : 'None',
	}));

	_(question.options()).each(function(option) {
		data.push(Ti.UI.createPickerRow({
			title : option.content
		}));
	});
	self.add(data);
	self.selectionIndicator = true;

	self.getValue = function() {
		val = self.getSelectedRow(null).getTitle();
		if (val == 'None')
			val = '';
		return val;
	};

	return self;
}

module.exports = QuestionWithOptionsView;
