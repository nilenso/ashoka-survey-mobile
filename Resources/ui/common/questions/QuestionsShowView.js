//All the questoin in a survey
function QuestionsShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');

	var convertQuestionDataForTable = function() {
		var data = [];
		var questions = Question.findBy('survey_id', surveyID);
		_(questions).each(function(question) {
			data.push({
				title : question['content']
			});
			Ti.API.info("foo" + data);
		});
		return data;
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

module.exports = QuestionsShowView;
