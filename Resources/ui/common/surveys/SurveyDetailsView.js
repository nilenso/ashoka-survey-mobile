var ResponsesNewWindow = require('ui/handheld/android/ResponsesNewWindow');
var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');
var loggedIn = require('helpers/LoginHelper').loggedIn;

function SurveysDetailsView(survey) {
  var self = Ti.UI.createView({
    height : '140dip',
    width : '100%'
  });

  var labelsView = Ti.UI.createView ({
    layout : 'vertical',
    width : '80%',
    height : '100%',
    left : Measurements.PADDING_X_SMALL,
    backgroundFocusedColor : Palette.SECONDARY_COLOR,
    backgroundSelectedColor : Palette.SECONDARY_COLOR
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
    font : { fontSize :Measurements.FONT_SMALL  }
  });

  var surveyInfoView = Ti.UI.createView({
    width : '100%'
  });

  var responseCountLabel = Ti.UI.createLabel({
    text : survey.incompleteResponseCount() + ' | ' +  survey.completeResponseCount(),
    color : Palette.PRIMARY_COLOR_LIGHT,
    right : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM }
  });
  var date = ((new Date(survey.expiry_date)).toDateString()).substring(4);

  var expiryDateLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + date,
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM }
  });

  var buttons = Ti.UI.createView({
    layout : 'vertical',
    height : '95%',
    width : '15%',
    right : Measurements.PADDING_X_SMALL
  });

  var addResponseButton = new ButtonView('+', {
    font : {
      fontSize : Measurements.FONT_BIG
    },
    width : '100%',
    height : '45%'
  });

  var syncResponseButton = new ButtonView('↻', {
    font : {
      fontSize : Measurements.FONT_BIG
    },
    width : '100%',
    height : '45%'
  });

  var canSync = function() {
    Ti.API.info("Login Info" + loggedIn());
    return (survey.responseCount() > 0);
  };

  buttons.add(addResponseButton);
  buttons.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
  buttons.add(syncResponseButton);
  syncResponseButton.enabled = canSync();

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : L('activity_indicator'),
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

  addResponseButton.addEventListener('click', function() {
    activityIndicator.show();
    ResponsesNewWindow(survey.id).open();
    activityIndicator.hide();
  });

  syncResponseButton.addEventListener('click', function() {
    syncResponseButton.enabled = false;
    self.fireEvent('SurveyDetailsView.sync_responses');
  });

  self.refresh = function() {
    responseCountLabel.setText(survey.incompleteResponseCount() + ' | ' +  survey.completeResponseCount());
    syncResponseButton.enabled = canSync();
  };

  labelsView.add(surveyNameLabel);
  labelsView.add(surveyDescriptionLabel);

  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);

  labelsView.add(surveyInfoView);
  self.add(labelsView);
  self.add(buttons);
  return (self);
}

module.exports = SurveysDetailsView;
