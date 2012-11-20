//All the questoin in a survey
function ResponsesNewView(surveyID) {
	var _ = require('lib/underscore')._;
	var Question = require('models/question');
	var Survey = require('models/survey');
	var Response = require('models/response');
	var QuestionView = require('ui/common/questions/QuestionView');
	var ResponseViewHelper = require('ui/common/responses/ResponseViewHelper');
	var responseViewHelper = new ResponseViewHelper;

	//Number of questions in a page
	var PAGE_SIZE = 5;

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

	var pagedQuestions = _.chain(questions).groupBy(function(a, b) {
		return Math.floor(b / PAGE_SIZE);
	}).toArray().value();

	var saveButton = Ti.UI.createButton({
		title : 'Save',
		width : '48%'
	});

	var completeButton = Ti.UI.createButton({
		title : 'Complete',
		width : '48%'
	});

	_(pagedQuestions).each(function(questions, pageNumber) {
		var questionsView = Ti.UI.createScrollView({
			layout : 'vertical'
		});

		_(questions).each(function(question) {
			var questionView = new QuestionView(question);
			allQuestionViews.add(questionView);
			questionsView.add(questionView);
		})

		if(pageNumber + 1 === pagedQuestions.length){
			questionsView.add(completeButton);
			questionsView.add(saveButton);
		}

		scrollableView.addView(questionsView);
	});

	var validateAndSaveAnswers = function(e, status) {
		var questionViews = responseViewHelper.getQuestionViews(allQuestionViews);
		var answersData = _(questionViews).map(function(fields, questionID) {
			Ti.API.info("questionid:" + questionID);
			Ti.API.info("content:" + fields['valueField'].getValue());
			return {
				'question_id' : questionID,
				'content' : fields.valueField.getValue()
			}
		});
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
