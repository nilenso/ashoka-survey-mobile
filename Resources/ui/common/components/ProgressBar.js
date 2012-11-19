var ProgressBarView = function() {

	var self = Ti.UI.createView({
		layout : 'vertical',
		backgroundColor : 'black',
		// opacity : 0.4,
		width : '100%',
		height : '100%'
	});

	var titleLabel = Ti.UI.createLabel({
		color : '#fff',
		font : {
			fontSize : 18
		},
		text : 'Fetching your surveys',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : '30%',
		width : 'auto'
	});

	var progressBar = Titanium.UI.createProgressBar({
		width : '100%',
		height : 'auto',
		min : 0,
		max : 10,
		value : 0,
		keepScreenOn : true,
		color : '#fff',
		font : {
			fontSize : 14,
			fontWeight : 'bold'
		}
	});
	var hideProgressBarIfComplete = function() {
		if (progressBar.getMax() == progressBar.getValue()) {
			progressBar.setValue(0);
			self.hide();
			progressBar.fireEvent('sync:complete');
		}
	}

	Ti.App.addEventListener('surveys.fetch.start', function(e) {
		titleLabel.setText("Fetching surveys...");
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.fetch.done', function(e) {
		progressBar.max = e.number_of_surveys;
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.questions.fetch.start', function(e) {
		titleLabel.setText("Fetching questions...");
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.questions.fetch.done', function(e) {
		progressBar.max = progressBar.getMax() + e.number_of_option_questions + e.number_of_images;
		progressBar.setValue(progressBar.getValue() + 1);
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.questions.options.fetch.start', function(e) {
		titleLabel.setText("Fetching options and sub questions...");
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.questions.options.fetch.done', function(e) {
		progressBar.max = progressBar.getMax() + e.number_of_option_sub_questions;
		progressBar.setValue(progressBar.getValue() + 1);
		Ti.API.info("After options : MAX is now: " + progressBar.getMax());
		Ti.API.info("Progress bar value is now: " + progressBar.getValue());
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.question.image.fetch.start', function(e) {
		titleLabel.setText("Fetching image...");
		hideProgressBarIfComplete();
	});

	Ti.App.addEventListener('surveys.question.image.fetch.done', function(e) {
		progressBar.setValue(progressBar.getValue() + 1);
		hideProgressBarIfComplete();
	});

	self.add(titleLabel);
	self.add(progressBar);
	return self;
}

module.exports = new ProgressBarView();
