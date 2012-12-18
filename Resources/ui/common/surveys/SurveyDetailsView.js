var ResponsesNewWindow = require('ui/handheld/android/ResponsesNewWindow');
var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');

function SurveysDetailsView(survey) {
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Ti.UI.SIZE
  });

  var surveyNameLabel = Ti.UI.createLabel({
    text : survey.name,
    color : Palette.PRIMARY_COLOR,
    left : Measurements.PADDING_SMALL,
    top : Measurements.PADDING_SMALL,
    font : { fontSize :Measurements.FONT_BIG  }
  });

  var surveyDescriptionLabel = Ti.UI.createLabel({
    text : survey.description,
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    top : Measurements.PADDING_SMALL,
    font : { fontSize :Measurements.FONT_MEDIUM  }
  });

  var surveyInfoView = Ti.UI.createView({
    height : Ti.UI.SIZE,
    width : '100%'
  });

  var responseCountLabel = Ti.UI.createLabel({
    text : survey.incompleteResponseCount() + ' | ' +  survey.completeResponseCount(),
    color : Palette.PRIMARY_COLOR_LIGHT,
    right : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM  }
  });
  var expiryDateLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + survey.expiry_date,
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM  }
  });

  var addResponseButton = new ButtonView('Add Response');

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : 'Loading...',
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

  addResponseButton.addEventListener('click', function() {
    activityIndicator.show();
    ResponsesNewWindow(survey.id).open();
    activityIndicator.hide();
  });

  self.refresh = function() {
    responseCountLabel.setText(survey.incompleteResponseCount() + ' | ' +  survey.completeResponseCount());
  };

  var headerSeparator = new SeparatorView(Palette.PRIMARY_COLOR, Measurements.PADDING_XX_SMALL);
  var rowSeparator = new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL);

  self.add(surveyNameLabel);
  self.add(surveyDescriptionLabel);

  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);

  self.add(surveyInfoView);
  self.add(addResponseButton);
  self.add(rowSeparator);
  self.add(headerSeparator);
  return (self);
}

module.exports = SurveysDetailsView;
