//MultiChoiceQuestionView Component Constructor
var _ = require('lib/underscore')._;
var OptionView = require('ui/common/questions/OptionView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var Response = require('models/response');

function MultiChoiceQuestionView(question, answer) {
  
  var optionIDs = answer ? answer.optionIDs() : null;
  var response = answer ? Response.findOneById(answer.response_id) : null;

	var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });
	
	var optionViews = {};

	_(question.options()).each(function(option) {
		var checked = optionIDs && _(optionIDs).contains(option.id);
		optionViews[option.id] = new OptionView(option, checked, response);		
	});
	
	_.chain(optionViews).values().each(function(view, index){
	  self.add(view);
	  if(index != _(optionViews).size() - 1) // Don't add a separator to the last option
	    self.add(new SeparatorView(Palette.PRIMARY_COLOR, '1dip'));
	});

	self.getValue = function() {
		var option_ids = [];
		_(optionViews).each(function(row, option_id) {
			if (row.children[0].children[0].getValue() === true)
				option_ids.push(option_id);
		});
		return option_ids;
	};

	return self;
};

module.exports = MultiChoiceQuestionView;
