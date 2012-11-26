//A single survey
function SurveyDetailsView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
  var TopLevelView = require('ui/common/components/TopLevelView');

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
	
	var self = new TopLevelView('Survey Details');

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertSurveyDataForTable()
	});

	var createResponseButton = Ti.UI.createButton({
		title : 'Add Response',
		width : '100%'
	});

	createResponseButton.addEventListener('click', function(e) {
		self.fireEvent('SurveyDetailsView:createResponse', {
			surveyID : surveyID
		});
	});

	var responsesIndexButton = Ti.UI.createButton({
		title : 'See all Responses',
		width : '100%'
	});

	responsesIndexButton.addEventListener('click', function(e) {
		self.fireEvent('SurveyDetailsView:responsesIndex', {
			surveyID: surveyID
		});
	});

	var buttonsView = Ti.UI.createView({
		layout : 'vertical'
	});
	buttonsView.add(createResponseButton);
	buttonsView.add(responsesIndexButton);

	table.setFooterView(buttonsView);

	self.add(table);
	return self;
}

module.exports = SurveyDetailsView;
