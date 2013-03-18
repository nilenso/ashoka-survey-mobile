//MultiChoiceQuestionView Component Constructor
var _ = require('lib/underscore')._;
var OptionView = require('ui/common/questions/OptionView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var Response = require('models/response');

function MultiChoiceQuestionView(question, answer, response, number, recordID) {

  var optionIDs = answer ? answer.optionIDs() : null;

	var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

	var optionViews = [];

	_(question.options()).each(function(option, index) {
		var checked = optionIDs && _(optionIDs).contains(option.id);
		var optionNumber = number + String.fromCharCode(97 + index);
		var optionView = new OptionView(option, checked, response, optionNumber, recordID);
		optionViews.push(optionView);
		self.add(optionView);
	});

	self.getValue = function() {
		var option_ids = [];
		_(optionViews).each(function(row) {
			if (row.children[0].children[0].getValue() === true)
				option_ids.push(row.optionId);
		});
		return option_ids;
	};

	self.getSubQuestions = function() {
		var subQuestionViews = [];
		_(optionViews).each(function(optionView) {
			subQuestionViews.push(optionView.getSubQuestions());
		});
		return _(subQuestionViews).flatten();
	};

	return self;
}

module.exports = MultiChoiceQuestionView;
