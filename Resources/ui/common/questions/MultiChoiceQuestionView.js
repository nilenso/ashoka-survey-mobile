//MultiChoiceQuestionView Component Constructor
var _ = require('lib/underscore')._;
var OptionView = require('ui/common/questions/OptionView');
function MultiChoiceQuestionView(question) {

	var self = Ti.UI.createTableView({
		height : Titanium.UI.SIZE
	});
	self.optionViews = {}

	Ti.API.info("options are:" + question.options());
	_(question.options()).each(function(option) {
		self.optionViews[option.id] = new OptionView(option);
	});

	self.setData(_(self.optionViews).values());

	self.getValue = function() {
		var option_ids = [];
		_(this.optionViews).each(function(row, option_id) {
			if (row.children[0].isChecked)
				option_ids.push(option_id);
		});
		return option_ids;
	}

	return self;
}

module.exports = MultiChoiceQuestionView;
