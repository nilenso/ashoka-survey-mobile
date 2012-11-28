//A single survey
function SurveyDetailsView(surveyID) {
  var _ = require('lib/underscore')._;
  var Survey = require('models/survey');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Palette = require('ui/common/components/Palette');
  var ButtonView = require('ui/common/components/ButtonView');

  var self = new TopLevelView('Survey Details');
  var survey = Survey.findOneById(surveyID);
  var detailsView = Ti.UI.createView({
    top : self.headerHeight,
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    layout : 'vertical',
  });
  var surveyNameLabel = Ti.UI.createLabel({
    top : '10dip',
    text : survey.name,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '20dip'
    }
  });
  var surveyDescriptionLabel = Ti.UI.createLabel({
    text : survey.description,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '15dip'
    }
  });
  var surveyExpiryLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + survey.expiry_date,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '15dip'
    }
  });
  detailsView.add(surveyNameLabel);
  detailsView.add(surveyDescriptionLabel);
  detailsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
  detailsView.add(surveyExpiryLabel);
  detailsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '20dip'));

  var createResponseButton = new ButtonView('Add Response');
  var responsesIndexButton = new ButtonView('See all Responses');

  detailsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
  detailsView.add(createResponseButton);
  detailsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
  detailsView.add(responsesIndexButton);

  createResponseButton.addEventListener('click', function(e) {
    self.fireEvent('SurveyDetailsView:createResponse', {
      surveyID : surveyID
    });
  });

  responsesIndexButton.addEventListener('click', function(e) {
    self.fireEvent('SurveyDetailsView:responsesIndex', {
      surveyID : surveyID
    });
  });

  self.add(detailsView);
  return self;
}

module.exports = SurveyDetailsView;
