//SurveysIndexView Component Constructor
function SurveysIndexView() {
	var Survey = require('models/survey');
	var _ = require('lib/underscore')._;
	var progressBar = require('ui/common/components/ProgressBar')

	var convertModelDataForTable = function() {
		return _(Survey.all()).map(function(survey) {
			return {
				title : survey.name,
				hasDetail : true,
				surveyID : survey.id
			}
		});
	}
	var showMessageIfModelIsEmpty = function() {
		if (Survey.isEmpty()) {
			self.add(label);
			self.remove(table);
		} else {
			self.remove(label);
			self.add(table);
		}
	}

	progressBar.addEventListener('sync:complete', function(e) {
		var _ = require('lib/underscore')._;
		data = convertModelDataForTable();
		table.setData(data);
		// alert("Sync complete")
		showMessageIfModelIsEmpty();
	});

	Ti.App.addEventListener('surveys.fetch.error', function(data) {
		progressBar.hide();
		if (data.status >= 400) {
			alert("Your server isn't responding. Sorry about that.");
		} else if (data.status == 0) {
			alert("Couldn't reach the server.");
		}
	});
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();
	
	Ti.App.addEventListener('surveys.fetch.start', function(e) {
		self.add(progressBar);
		progressBar.show();
	});
	
	
	var table = Titanium.UI.createTableView({
		data : convertModelDataForTable()
	});

	table.addEventListener('click', function(e) {
		self.fireEvent('surveys_index_view.table_row_clicked', {
			surveyID : e.rowData.surveyID
		});
	});

	label = Ti.UI.createLabel({
		color : '#333',
		font : {
			fontSize : 18
		},
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
