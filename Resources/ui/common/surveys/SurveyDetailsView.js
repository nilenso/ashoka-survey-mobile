//A single survey
function SurveyDetailsView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
	var convertSurveyDataForTable = function() {
		var attrs = Survey.findOneById(surveyID)
		return [{
			header : 'Name',
			title : attrs['name']
		}, {
			header : 'Description',
			title : attrs['description']
		}, {
			header : 'Expires On',
			title : attrs['expiry_date']
		}];
	}
	self = Ti.UI.createView({
		layout : 'vertical'
	});

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertSurveyDataForTable(),
	});

	var createResponseButton = Ti.UI.createButton({
		title : 'Add Response',
		height : 30,
		width : 200
	});

	var row = Titanium.UI.createTableViewRow();
	row.add(createResponseButton);
	table.appendRow(row);

	createResponseButton.addEventListener('click', function(e) {
		Ti.App.fireEvent('SurveyDetailsView:createResponse');
	});

	var responsesIndexButton = Ti.UI.createButton({
		title : 'Show all Responses',
		height : 30,
		width : 200
	});

	var row = Titanium.UI.createTableViewRow();
	row.add(responsesIndexButton);
	table.appendRow(row);

	responsesIndexButton.addEventListener('click', function(e) {
		Ti.App.fireEvent('SurveyDetailsView:responsesIndex');
	});

	self.add(table);
	return self;
}

module.exports = SurveyDetailsView;
