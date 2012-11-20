//All the questoin in a survey
function ResponsesNewView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Survey = require('models/survey');
	var Response = require('models/response');
	var QuestionView = require('ui/common/questions/QuestionView');
	var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
	var responseViewHelper = new ResponseViewHelper;

	var self = Ti.UI.createView({
		layout : 'vertical'
	})

	var scrollableView = Ti.UI.createScrollableView({
		showPagingControl : true
	});
	self.add(scrollableView);

	var survey = Survey.findOneById(surveyID);
	var questions = survey.firstLevelQuestions();
	
	var allQuestionViews = Ti.UI.createView();
	
	var saveButton = Ti.UI.createButton({
		title : 'Save',
		width : '48%'
	});

	var completeButton = Ti.UI.createButton({
		title : 'Complete',
		width : '48%'
	});
	
	responseViewHelper.paginate(questions, allQuestionViews, scrollableView, [saveButton, completeButton]);

	var getCurrentLocation = function() {
		var location = {};
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (e.error) {
				Ti.API.info("Error getting location");
				return;
			}
			location.longitude = e.coords.longitude;
			location.latitude = e.coords.latitude;
			Ti.API.info("longitude = " + e.coords.longitude);
			Ti.API.info("latitude = " + e.coords.latitude);
		});
		return location;
	};
	
	var validateAndSaveAnswers = function(e, status) {
		var questionViews = responseViewHelper.getQuestionViews(self);
		var answersData = _(questionViews).map(function(fields, questionID) {
			Ti.API.info("questionid:" + questionID);
			Ti.API.info("content:" + fields['valueField'].getValue());
			return {
				'question_id' : questionID,
				'content' : fields.valueField.getValue()
			}
		});
		var responseLocation = getCurrentLocation();
		responseErrors = Response.validate(answersData, status);
		if (!_.isEmpty(responseErrors)) {
			responseViewHelper.displayErrors(responseErrors, questionViews);
			alert("There were some errors in the response.");
		} else {
			Response.createRecord(surveyID, status, answersData);
			self.fireEvent('ResponsesNewView:savedResponse');
		}
	};

	completeButton.addEventListener('click', function(event) {
		validateAndSaveAnswers(event, "complete");
	});
	
	saveButton.addEventListener('click', function(event) {
		validateAndSaveAnswers(event, "incomplete");
	});

	return self;
}

module.exports = ResponsesNewView;
