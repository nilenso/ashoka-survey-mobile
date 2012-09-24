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

	self.add(table);

	return self;
}

module.exports = SurveyDetailsView;
