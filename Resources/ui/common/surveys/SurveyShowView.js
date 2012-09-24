//A single survey
function SurveyShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
	var Question = require('models/question');
	var QuestionsShowView = require('ui/common/questions/QuestionsShowView');
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView');

	self = Ti.UI.createScrollableView({
		layout : 'vertical'
	});

	self.addView(new SurveyDetailsView(surveyID));
	self.addView(new QuestionsShowView(surveyID));

	return self;
}

module.exports = SurveyShowView;
