var ProgressBarView = function() {
	// now assign that array to the table's data property to add those objects as rows
	var progressBar = Titanium.UI.createProgressBar({
		bottom : 2,
		width : '100%',
		height : 'auto',
		min : 0,
		max : 10,
		value : 0,
		keepScreenOn : true,
		color : '#fff',
		message : 'Fetching your surveys...',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}
	});
	var hideProgressBarIfComplete = function() {
		if (progressBar.getMax() == progressBar.getValue()) {
			progressBar.setValue(0);
			progressBar.hide();
			progressBar.fireEvent('sync:complete');
		}
	}

	Ti.App.addEventListener('surveys.fetch.done', function(e) {
		progressBar.setMax(e.number_of_surveys);
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.questions.fetch.done', function(e) {
		progressBar.setValue(progressBar.getValue() + 1);
		progressBar.setMax(progressBar.getMax() + e.number_of_option_questions);
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.question.options.fetch.done', function(e) {
		progressBar.setValue(progressBar.getValue() + 1);
		hideProgressBarIfComplete();
	});
	
	return progressBar;
}

module.exports = new ProgressBarView(); 