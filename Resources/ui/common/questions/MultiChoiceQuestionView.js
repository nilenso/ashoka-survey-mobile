//MultiChoiceQuestionView Component Constructor
var _ = require('lib/underscore')._;
var OptionView = require('ui/common/questions/OptionView');
function MultiChoiceQuestionView(question) {

	var self = Ti.UI.createTableView({
		height : Titanium.UI.SIZE
	});
	
	var optionViews = {};

	_(question.options()).each(function(option) {
		optionViews[option.id] = new OptionView(option);
	});
	
	self.setData(_(optionViews).values());

	self.getValue = function() {
		var option_ids = [];
		_(optionViews).each(function(row, option_id) {
			if (row.children[0].getValue() === true)
				option_ids.push(option_id);
		});
		return option_ids;
	}

	return self;
}

module.exports = MultiChoiceQuestionView;
