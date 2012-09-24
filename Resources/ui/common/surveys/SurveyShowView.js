//A single survey
function SurveyShowView(surveyID) {
	var _ = require('lib/underscore')._;
	var Survey = require('models/survey');
	var Question = require('models/question');
	var QuestionShowView = require('ui/common/questions/QuestionShowView');
	var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView');

	self = Ti.UI.createScrollableView({
		layout : 'vertical'
	});

	self.addView(new SurveyDetailsView(surveyID));

	var questions = Question.findBy('survey_id', surveyID);
	_(questions).each(function(question) {
		self.addView(new QuestionShowView(question.id));
	});

	return self;
}

module.exports = SurveyShowView;
