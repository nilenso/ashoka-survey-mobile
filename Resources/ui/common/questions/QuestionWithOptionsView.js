//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
function QuestionWithOptionsView(question, content) {

	var self = Ti.UI.createPicker({
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
	
	if (content) {
		_(data).each(function(option, index) {
			if (option.title == content) 
				self.setSelectedRow(0, index);
		});
	}

	self.getValue = function() {
		val = self.getSelectedRow(null).getTitle();
		if (val == 'None')
			val = '';
		return val;
	};

	return self;
}

module.exports = QuestionWithOptionsView;
