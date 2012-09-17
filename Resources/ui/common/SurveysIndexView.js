//SurveysIndexView Component Constructor
function SurveysIndexView(model) {
	var _ = require('lib/underscore')._;
	var convertModelDataForTable = function() {
		return _(model.list()).map(function(survey) {
			return {
				title : survey.name,
				hasDetail : true,
				surveyID : survey.id
			}
		});
	}
	
	var showMessageIfModelIsEmpty = function() {
		Ti.API.info("MODEL IS " + model.isEmpty().toString());
		if(model.isEmpty()) {
			self.add(label);
			self.remove(table);
		} else {
			self.remove(label);
			self.add(table);	
		}
	}

	Ti.App.addEventListener('surveys.fetch.success', function(e) {
		var _ = require('lib/underscore')._;
		data = convertModelDataForTable();
		table.setData(data);
		showMessageIfModelIsEmpty();
	});

	Ti.App.addEventListener('surveys.fetch.error', function(data) {
		if (data.status >= 400) {
			alert("Your server isn't responding. Sorry about that.");
		} else if (data.status == 0) {
			alert("Couldn't reach the server.");
		}
	});

	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertModelDataForTable()
	});

	table.addEventListener('click', function(e) {
		Ti.App.fireEvent('surveys_index_view.table_row_clicked', {
			surveyID : e.rowData.surveyID
		});
	});

	label = Ti.UI.createLabel({
		color : '#333',
		font : { fontSize : 18 },
		text : 'No surveys here. Please perform a sync.',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : '40%',
		width : 'auto',
		height : 'auto'
	});
	
	showMessageIfModelIsEmpty();
	return self;
}

module.exports = SurveysIndexView;
