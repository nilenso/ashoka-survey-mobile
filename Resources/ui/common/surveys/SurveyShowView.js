//A single survey
function SurveyShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
	var Question = require('models/question');
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView');
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView');
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
	var ResponseShowView = require('ui/common/responses/ResponseShowView');

	self = Ti.UI.createScrollableView({
		layout : 'vertical'
	});

	details = new SurveyDetailsView(surveyID);
	newResponse = new ResponsesNewView(surveyID);
	allResponses = new ResponsesIndexView(surveyID);
	self.addView(details);

	Ti.App.addEventListener('ResponsesNewView:savedResponse', function() {
		views = [];
		views.push(details);
		self.setViews(views);
	});

	Ti.App.addEventListener('SurveyDetailsView:createResponse', function() {
		views = [];
		views.push(newResponse);
		self.setViews(views);
	})

	Ti.App.addEventListener('SurveyDetailsView:responsesIndex', function() {
		views = [];
		views.push(allResponses);
		self.setViews(views);
	})

	Ti.App.addEventListener('responses_index_view.table_row_clicked', function(data) {
		views = [];
		views.push(oneResponse = new ResponseShowView(surveyID));
		self.setViews(views);
	});

	return self;
}

module.exports = SurveyShowView;
