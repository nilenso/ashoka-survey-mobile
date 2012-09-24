//All the questoin in a survey
function QuestionsShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');

	var table = Titanium.UI.createTableView();
	var tableData = []

	var questions = Question.findBy('survey_id', surveyID);
	_(questions).each(function(question) {
		var label_row = Titanium.UI.createTableViewRow();
		var label = Ti.UI.createLabel({
			color : '#000000',
			text : question['content'],
			height : 'auto',
			width : 'auto',
			left : 5
		});
		label_row.add(label);
		tableData.push(label_row);

		var answer_row = Titanium.UI.createTableViewRow();
		var textField = Ti.UI.createTextField({
			borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
			color : '#336699',
			right : 5,
			left : 5,
			value : 'Answer'
		});
		answer_row.add(textField);
		tableData.push(answer_row);
	});

	table.setData(tableData);

	self = Ti.UI.createView({
		layout : 'vertical'
	});

	self.add(table);

	return self;
}

module.exports = QuestionsShowView;
