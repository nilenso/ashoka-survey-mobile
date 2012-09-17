//SurveysIndexView Component Constructor
function SurveysIndexView(model) {
	var convertModelDataForTable = function() {
		var _ = require('lib/underscore')._;
		return _(model.list()).map(function(survey) {
			return { title : survey.name, hasDetail: true, surveyID: survey.id }
		});
	}

	Ti.App.addEventListener('surveys.fetch.success', function(e) {
		var _ = require('lib/underscore')._;
		data = convertModelDataForTable();
		table.setData(data);
	});
	
	Ti.App.addEventListener('surveys.fetch.error', function(data){
		if(data.status >= 400){
			alert("Your server is bogus. Sorry about that.");
		} else if (data.status == 0){
			alert("Couldn't reach the server.");
		}
	});

	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertModelDataForTable()
	});
	
	table.addEventListener('click', function(e){
		Ti.App.fireEvent('surveys_index_view.table_row_clicked', {surveyID: e.rowData.surveyID });
	});

	self.add(table);

	return self;
}

module.exports = SurveysIndexView;
