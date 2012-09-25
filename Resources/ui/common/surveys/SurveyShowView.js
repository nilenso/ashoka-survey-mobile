//A single survey
function SurveyShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
	var Question = require('models/question');
	var ResponsesNewView = require('ui/common/responses/ResponsesNewView');
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView');

	self = Ti.UI.createScrollableView({
		layout : 'vertical'
	});

	self.addView(new SurveyDetailsView(surveyID));
	self.addView(new ResponsesNewView(surveyID));
	
	Ti.App.addEventListener('ResponsesNewView:savedResponse', function(){
		self.scrollToView(0);
	});
	
	Ti.App.addEventListener('SurveyDetailsView:createResponse', function(){
		self.scrollToView(1);
	})

	return self;
}

module.exports = SurveyShowView;
