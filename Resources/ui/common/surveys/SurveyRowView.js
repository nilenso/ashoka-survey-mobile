var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var Measurements = require('ui/common/components/Measurements');

function SurveysRowView(survey) {
  var self = Ti.UI.createTableViewRow({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    hasDetail : true,
    surveyID : survey.id,
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
    width : '100%'
  });

  var responseCountLabel = Ti.UI.createLabel({
    text : '[' + survey.responseCount() + ']',
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

  var incompleteResponseCountLabel = Ti.UI.createLabel({
    text : 'Incomplete responses: ' + survey.incompleteResponseCount(),
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM  }
  });

  var completeResponseCountLabel = Ti.UI.createLabel({
    text : 'Complete responses: ' + survey.completeResponseCount(),
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_MEDIUM  }
  });

  var rowSeparator = new SeparatorView(Palette.WHITE, Measurements.PADDING_SMALL);

  self.add(rowSeparator);
  self.add(surveyNameLabel);
  self.add(surveyDescriptionLabel);
  
  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);
  
  self.add(completeResponseCountLabel);
  self.add(incompleteResponseCountLabel);
  self.add(surveyInfoView);
  return (self);
}

module.exports = SurveysRowView;
