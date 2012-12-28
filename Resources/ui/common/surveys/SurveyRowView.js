var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');

function SurveysRowView(survey) {
  var ROW_HEIGHT = 140;

  var self = Ti.UI.createView({
    height : ROW_HEIGHT + 'dip',
    surveyID : survey.id,
    top : '10dip',
    left : '10dip'
  });

  //Create a drop shadow view
  var shadow = Ti.UI.createView({
    width : '98%',
    height : '98%',
    left : '0dip',
    right : '2dip',
    bottom : '0dip',
    borderRadius : 5,
    opacity : 0.5,
    backgroundColor : Palette.SECONDARY_COLOR_DARK
  });
  self.add(shadow);

  //Create a view for our content
  var content = Ti.UI.createView({
    width : '98%',
    height : '98%',
    top : '0dip',
    left : '2dip',
    borderRadius : 5,
    backgroundColor : Palette.WHITE,
    backgroundFocusedColor : Palette.SECONDARY_COLOR,
    backgroundSelectedColor : Palette.SECONDARY_COLOR
  });
  self.add(content);

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
    width : '100%',
    bottom : '0dip'
  });

  var responseCountLabel = Ti.UI.createLabel({
    text :  survey.incompleteResponseCount() + ' | ' +  survey.completeResponseCount(),
    right : Measurements.PADDING_SMALL,
    color : Palette.PRIMARY_COLOR_LIGHT,
    font : {
      fontSize : Measurements.FONT_MEDIUM  }
  });

  var date = ((new Date(survey.expiry_date)).toDateString()).substring(4);

  var expiryDateLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + date,
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM }
  });

  var addResponseButton = new ButtonView('+', {
    font : {
      fontSize : Measurements.FONT_BIG
    },
    width : '15%',
    height : '100%',
    right : '0dip'
  });

  addResponseButton.addEventListener('click', function () {
    self.fireEvent('surveys_row_view.add_response_clicked');
  });

  labelsView.addEventListener('click', function(e) {
    content.setBackgroundColor(Palette.SECONDARY_COLOR);
    self.fireEvent('surveys_row_view.row_clicked');
  });

  labelsView.add(surveyNameLabel);
  labelsView.add(surveyDescriptionLabel);

  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);

  labelsView.add(surveyInfoView);
  content.add(labelsView);
  content.add(addResponseButton);
  return (self);
}

module.exports = SurveysRowView;
