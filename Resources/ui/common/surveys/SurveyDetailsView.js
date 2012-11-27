//A single survey
function SurveyDetailsView(surveyID) {
  var _ = require('lib/underscore')._;
  var Survey = require('models/survey');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Palette = require('ui/common/components/Palette');

  var survey = Survey.findOneById(surveyID);
  var detailsView = Ti.UI.createView({
    top : '48dip',
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    layout : 'vertical',
  });
  var surveyNameLabel = Ti.UI.createLabel({
    text : survey.name,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '15dip'
    }
  });
  var surveyDescriptionLabel = Ti.UI.createLabel({
    text : survey.description,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '10dip'
    }
  });
  var surveyExpiryLabel = Ti.UI.createLabel({
    text : 'Expires on: ' + survey.expiry_date,
    color : Palette.PRIMARY_COLOR,
    left : '5dip',
    font : {
      fontSize : '10dip'
    }
  });
  detailsView.add(surveyNameLabel);
  detailsView.add(surveyDescriptionLabel);
  detailsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
  detailsView.add(surveyExpiryLabel);

  var self = new TopLevelView('Survey Details');

  var createResponseButton = Ti.UI.createButton({
    title : 'Add Response',
    backgroundColor : Palette.PRIMARY_COLOR,
    backgroundSelectedColor : Palette.PRIMARY_COLOR_LIGHT,
    backgroundFocusedColor : Palette.PRIMARY_COLOR_LIGHT,
    color : Palette.SECONDARY_COLOR_LIGHT,
    width : '80%',
    font : {
      size : '20dip'
    },
    height : '30dip'
  });

  var responsesIndexButton = Ti.UI.createButton({
    title : 'See all Responses',
    backgroundColor : Palette.PRIMARY_COLOR,
    backgroundSelectedColor : Palette.PRIMARY_COLOR_LIGHT,
    backgroundFocusedColor : Palette.PRIMARY_COLOR_LIGHT,
    color : Palette.SECONDARY_COLOR_LIGHT,
    width : '80%',
    font : {
      size : '20dip'
    },
    height : '30dip'
  });

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
