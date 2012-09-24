//A single survey
function QuestionShowView(questionID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var convertQuestionDataForTable = function() {
		var attrs = Question.findOneById(questionID);
		return [{
		  title : attrs['content']
		}];
	}

	self = Ti.UI.createView({
		layout : 'vertical'
	});

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertQuestionDataForTable(),
	});

	self.add(table);

	return self;
}

module.exports = QuestionShowView;
