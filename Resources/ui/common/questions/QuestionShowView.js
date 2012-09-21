//A single survey
function QuestionShowView(questionID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var convertSurveyDataForTable = function() {
		var attrs = _(Question.all()).find(function(question) {
			return question.id == questionID
		});
		return [{
		  title : attrs['content']
		}];
	}
	
	self = Ti.UI.createView({
		layout : 'vertical'
	});

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertSurveyDataForTable(),
		style : Titanium.UI.iPhone.TableViewStyle.GROUPED
	});

	self.add(table);

	return self;
}

module.exports = QuestionShowView;
