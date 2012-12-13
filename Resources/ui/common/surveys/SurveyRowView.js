var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var ButtonView = require('ui/common/components/ButtonView');
var Measurements = require('ui/common/components/Measurements');

function SurveysRowView(survey) {
  var self = Ti.UI.createTableViewRow({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    hasDetail : true,
    surveyID : survey.id,
    layout : 'vertical',
    height : Ti.UI.SIZE
  });

  var labelsView = Ti.UI.createView ({
    layout : 'vertical'
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

  var addResponseButton = new ButtonView('Add Response');
  
  addResponseButton.addEventListener('click', function () {
    self.fireEvent('surveys_row_view.add_response_clicked');
  });


  labelsView.addEventListener('click', function(e) {
    self.fireEvent('surveys_row_view.row_clicked');
  });

  var rowSeparator = new SeparatorView(Palette.WHITE, Measurements.PADDING_SMALL);

  self.add(rowSeparator);
  labelsView.add(surveyNameLabel);
  
  surveyInfoView.add(expiryDateLabel);
  surveyInfoView.add(responseCountLabel);
  
  labelsView.add(completeResponseCountLabel);
  labelsView.add(incompleteResponseCountLabel);
  labelsView.add(surveyInfoView);
  self.add(labelsView);
  self.add(addResponseButton);
  return (self);
}

module.exports = SurveysRowView;
