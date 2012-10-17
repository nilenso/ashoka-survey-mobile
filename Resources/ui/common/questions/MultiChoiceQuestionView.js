//MultiChoiceQuestionView Component Constructor
var _ = require('lib/underscore')._;
var OptionView = require('ui/common/questions/OptionView');
function MultiChoiceQuestionView(question) {

	var self = Ti.UI.createTableView({
		height : Titanium.UI.SIZE
	});
	data = [];

	Ti.API.info("options are:"+ question.options());
	_(question.options()).each(function(option){
		data.push(new OptionView(option));
	});
	
	self.setData(data);
	

	return self;
}

module.exports = MultiChoiceQuestionView;
