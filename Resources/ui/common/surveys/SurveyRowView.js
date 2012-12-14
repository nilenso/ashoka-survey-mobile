var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');

function SurveysRowView(survey) {
  var ROW_HEIGHT = 80;

  var self = Ti.UI.createTableViewRow({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    backgroundFocusedColor : Palette.SECONDARY_COLOR,
    backgroundSelectedColor : Palette.SECONDARY_COLOR,
    hasDetail : true,
    surveyID : survey.id,
    height : ROW_HEIGHT + 'dip'
  });

  var labelsView = Ti.UI.createView ({
    layout : 'vertical',
    width : '85%',
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

  var surveyInfoView = Ti.UI.createView({
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

  var addResponseButton = Ti.UI.createButton({
    title : '+',
    font : {
      fontSize : Measurements.FONT_X_BIG
    },
    color : Palette.PRIMARY_COLOR,
    backgroundColor : Palette.SECONDARY_COLOR,
    width : ROW_HEIGHT / 2  + 'dip',
    height : ROW_HEIGHT / 2  + 'dip',
    right : Measurements.PADDING_SMALL,
    backgroundFocusedColor : Palette.SECONDARY_COLOR_LIGHT,
    backgroundSelectedColor : Palette.SECONDARY_COLOR_LIGHT,
    borderWidth : 1,
    borderColor : Palette.SECONDARY_COLOR_DARK,
    borderRadius : Measurements.BORDER_RADIUS
  });

  addResponseButton.addEventListener('click', function () {
    self.fireEvent('surveys_row_view.add_response_clicked');
  });

  labelsView.addEventListener('click', function(e) {

    self.fireEvent('surveys_row_view.row_clicked');
  });

  var rowSeparator = new SeparatorView(Palette.WHITE, Measurements.PADDING_SMALL);

  // self.add(rowSeparator);
  labelsView.add(surveyNameLabel);

  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);

  labelsView.add(surveyInfoView);
  self.add(labelsView);
  self.add(addResponseButton);
  return (self);
}

module.exports = SurveysRowView;
