//QuestionWithOptionsView Component Constructor
var _ = require('lib/underscore')._;
var Option = require('models/option');

function QuestionWithOptionsView(question, content) {
	var view_height = 400;
	var self = Ti.UI.createView({
		layout : 'vertical',
		height : view_height
	});

	var picker = Ti.UI.createPicker({
		color : '#336699',
		right : 5,
		left : 5,
		height : Titanium.UI.SIZE

	});

	var data = [];

	data.push(Ti.UI.createPickerRow({
		title : 'None'
	}));

	_(question.options()).each(function(option) {
		Ti.API.info("foo");
		var optionRow = Ti.UI.createPickerRow({
			title : option.content,
			id : option.id
		});
		data.push(optionRow);
	});

	picker.add(data);
	picker.selectionIndicator = true;

	self.add(picker);

	picker.addEventListener('change', function() {
		var top_margin = 0;
		var option = Option.findOneById(picker.getSelectedRow(null).getId());
		_(self.getChildren()).each(function(childView) {
			if (childView != picker)
				self.remove(childView);
		});
		var questions = option.subQuestions();
		_(questions).each(function(question) {
			var questionView = Ti.UI.createLabel({
				color : '#000000',
				text : question.content,
				height : Titanium.UI.SIZE,
				width : Titanium.UI.SIZE,
				left : 5
			});
			self.add(questionView);
		});
		return self;
	});

	if (content) {
		_(data).each(function(option, index) {
			if (option.title == content)
				picker.setSelectedRow(0, index);
		});
	}

	self.getValue = function() {
		val = picker.getSelectedRow(null).getTitle();
		if (val == 'None')
			val = '';
		return val;
	};

	return self;
}

module.exports = QuestionWithOptionsView;
