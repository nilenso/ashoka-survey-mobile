var Survey = require('models/survey');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');

function SurveysRowView(survey) {
  var self = Ti.UI.createTableViewRow({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    hasDetail : true,
    surveyID : survey.id,
    layout : 'vertical',
    height : '100dip'
  });
  var surveyNameLabel = Ti.UI.createLabel({
  text : survey.name,
  color : Palette.PRIMARY_COLOR,
  left : '5dip',
  top : '5dip',
  font : { fontSize :'20dip'
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
    fontSize : '15dip'
  }
});
var expiryDateLabel = Ti.UI.createLabel({
  text : 'Expires on: ' + survey.expiry_date,
  color : Palette.PRIMARY_COLOR_LIGHT,
  left : '5dip',
  font : {
    fontSize : '15dip'
  }
});

var incompleteResponseCountLabel = Ti.UI.createLabel({
  text : 'Incomplete responses: ' + survey.incompleteResponseCount(),
  color : Palette.PRIMARY_COLOR_LIGHT,
  left : '5dip',
  font : {
    fontSize : '15dip'
  }
});

var completeResponseCountLabel = Ti.UI.createLabel({
  text : 'Complete responses: ' + survey.completeResponseCount(),
  color : Palette.PRIMARY_COLOR_LIGHT,
  left : '5dip',
  font : {
    fontSize : '15dip'
  }
});

var rowSeparator = new SeparatorView(Palette.WHITE, '5dip');

self.add(rowSeparator);
self.add(surveyNameLabel);
surveyInfoView.add(expiryDateLabel);
surveyInfoView.add(responseCountLabel);
self.add(completeResponseCountLabel);
self.add(incompleteResponseCountLabel);
self.add(surveyInfoView);
return (self);
}

module.exports = SurveysRowView;
