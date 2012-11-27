var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');

function SurveysRowView(survey) {
  var self = Ti.UI.createTableViewRow({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    hasDetail : true,
    surveyID : survey.id,
    layout : 'vertical'
  });
  var surveyNameLabel = Ti.UI.createLabel({
    text : survey.name,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '15dip'
    }
  });
  var surveyInfoView = Ti.UI.createView({
    width : '100%'
  });

  var responseCountLabel = Ti.UI.createLabel({
    text : '[' + survey.responseCount() + ']',
    color : Palette.PRIMARY_COLOR_LIGHT,
    right : '5dip',
    font : {
      fontSize : '10dip'
    }
  });
  var expiryDateLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + survey.expiry_date,
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : '5dip',
    font : {
      fontSize : '10dip'
    }
  });
  self.add(surveyNameLabel);
  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);
  self.add(surveyInfoView);
  return (self);
}

module.exports = SurveysRowView;
