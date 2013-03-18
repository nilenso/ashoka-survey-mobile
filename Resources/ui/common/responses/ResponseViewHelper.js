var _ = require('lib/underscore')._;
var Question = require('models/question');
var QuestionView = require('ui/common/questions/QuestionView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');

function ResponseViewHelper() {
  var self = {};
  var PAGE_SIZE = 7;

  var footerView = function(pageNumber, totalPages) {
    var footerText = "<< Swipe to turn pages (" + pageNumber + "/" + totalPages + ")  >>";
    return Ti.UI.createLabel({
      text : footerText,
      textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
      color : Palette.PRIMARY_COLOR_LIGHT,
      backgroundColor : Palette.GRAY_LIGHT,
      height : '40dip',
      font : {
        fontSize : Measurements.FONT_MEDIUM      },
      width : '100%'
    });
  };

  self.resetErrors = function(questionViews) {
    _(questionViews).each(function(questionView) {
      questionView.resetError();
    });
  };

  self.displayErrors = function(responseErrors, questionViews) {
    self.resetErrors(questionViews);
    for (var question_id in responseErrors) {
      for (var field in responseErrors[question_id]) {
        var questionViewWithError = _(questionViews).find(function(questionView){
          return parseInt(questionView.id) === parseInt(question_id);
        });
        questionViewWithError.setError(responseErrors[question_id][field]);
        Ti.API.info(responseErrors[question_id][field]);
      }
    }
  };

  self.getQuestionViews = function(parent) {
    var questionViews = [];
    var views;
    if (parent) {
      views = _.chain(parent).map(function(scrollView) {
        return scrollView.children;
      }).flatten().value();
    }
    _(views).each(function(view) {
      if (view.type === 'question') {
        questionViews.push(view);
      }
    });
    return questionViews ;
  };

  self.groupQuestionsByPage = function(questions) {
    var pages = [];
    var currentPage = 0;

    _(questions).each(function(question) {
      //Put first level categories on their own page. Don't do it if the very first question is a category.
      if(question.type === 'category' && pages[currentPage]) {
        if(question.isFirstLevel() || pages[currentPage].length === (PAGE_SIZE -1)) {
          currentPage++;
        }
      }

      pages[currentPage] = pages[currentPage] || [];
      question.pageNumber = currentPage;
      pages[currentPage].push(question);

      if(question.type === 'question' && pages[currentPage].length >= PAGE_SIZE) {
        currentPage++;
      }
    });

    return pages;
  };

  var saveButton = function(clickHandler) {
    var saveButtonView = new ButtonView('Save as Draft', {
      'width' : '48%'
    });
    saveButtonView.addEventListener('click', function(event) {
      clickHandler(event, "incomplete");
    });

    return saveButtonView;
  };

  var completeButton = function(clickHandler) {
    var completeButtonView = new ButtonView('Complete', {
      'width' : '48%'
    });
    completeButtonView.addEventListener('click', function(event) {
      clickHandler(event, "complete");
    });

    return completeButtonView;
  };

  self.paginate = function(questionViews, scrollableView, response, buttonClickHandler) {

    questionViews = _.chain(questionViews).map(function(view){
      var children = view.getSubQuestions();
        if(children)
          return [view,children];
        else
          return [view];
    }).flatten().value();

    var pagedQuestions = self.groupQuestionsByPage(questionViews);

    var views = _(pagedQuestions).map(function(questions, pageNumber) {
      var questionsView = Ti.UI.createScrollView({
        layout : 'vertical'
      });

      _(questions).each(function(questionView, number) {
        questionsView.add(questionView);
      });

      if (!response || response.isNotComplete()) {
        questionsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
        questionsView.add(saveButton(buttonClickHandler));
      }
      questionsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));

      if (pageNumber + 1 === pagedQuestions.length) {
        questionsView.add(completeButton(buttonClickHandler));
      } else {
        questionsView.add(footerView(pageNumber + 1, pagedQuestions.length));
      }
      return questionsView;
    });
    
    scrollableView.views = views;
  };

  self.scrollToFirstErrorPage = function(scrollableView, errors) {
    var views = scrollableView.getViews();
    var questionViews = self.getQuestionViews(views);
    var pagesWithErrors = [];
    for (var question_id in errors) {
      var questionViewWithError = _(questionViews).find(function(questionView) {
        return parseInt(questionView.id) === parseInt(question_id);
      });
      pagesWithErrors.push(questionViewWithError.pageNumber);
    }
    firstPageWithErrors =_(pagesWithErrors).min();
    scrollableView.scrollToView(views[firstPageWithErrors]);
    return pagesWithErrors;
  };

  return self;
}

module.exports = ResponseViewHelper;
