//SurveysIndexView Component Constructor
function SurveysIndexView() {
	var Survey = require('models/survey');
	var _ = require('lib/underscore')._;
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

	Ti.App.addEventListener('surveys.fetch.success', function(e) {
		var _ = require('lib/underscore')._;
		data = convertModelDataForTable();
		table.setData(data);
		// alert("Sync complete")
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
	var progressBar = Titanium.UI.createProgressBar({
		bottom: 2,
		width : '100%',
		height : 'auto',
		min : 0,
		max : 10,
		value : 0,
		color : '#fff',
		message : 'Fetching your surveys...',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}
	});
	var hideProgressBarIfComplete = function(){
		if(progressBar.getMax() == progressBar.getValue()) {
			progressBar.setValue(0);			
			progressBar.hide();
		}
	}
	
	Ti.App.addEventListener('surveys.fetch.done', function(e){
		self.add(progressBar);
		progressBar.setMax(e.number_of_surveys);
		progressBar.show();
		hideProgressBarIfComplete();
	});
	
	Ti.App.addEventListener('surveys.questions.fetch.done', function(e) {
		progressBar.setValue(progressBar.getValue() + 1);
		progressBar.setMax(progressBar.getMax() + e.number_of_option_questions);
		hideProgressBarIfComplete();
	});
	
	Ti.App.addEventListener('surveys.question.options.fetch.done', function(e){
		progressBar.setValue(progressBar.getValue() + 1);
		hideProgressBarIfComplete();
	})
	
	
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
