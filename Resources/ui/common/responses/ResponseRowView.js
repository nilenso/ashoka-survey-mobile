var _ = require('lib/underscore')._;
var Response = require('models/response');
var Palette = require('ui/common/components/Palette');
var SeparatorView = require('ui/common/components/SeparatorView');
var Measurements = require('ui/common/components/Measurements');

function ResponseRowView(response) {
  var self = Ti.UI.createTableViewRow({
    height : Titanium.UI.SIZE,
    layout : 'vertical',
    responseID : response.id
  });

  var rowContent = Ti.UI.createView({
    backgroundColor : Palette.WHITE,
    borderRadius : Measurements.BORDER_RADIUS,
    width : '95%',
    layout : 'horizontal'
  });

  self.add(rowContent);

  var identifierAnswersView = Ti.UI.createView({
    width : '90%',
    layout : 'vertical',
    left : Measurements.PADDING_MEDIUM
  });

  rowContent.add(identifierAnswersView);

  var responseLabel = Ti.UI.createLabel({
    text : "#" + response.id.toString(),
    color : Palette.SECONDARY_COLOR,
    right : Measurements.PADDING_SMALL,
    font : {
      fontSize : Measurements.FONT_SMALL
    }
  });

  rowContent.add(responseLabel);

  var answersData = _(response.identifierAnswers()).each(function(answer) {
    var view = Ti.UI.createView({
      layout : 'horizontal'
    });
    var label = Ti.UI.createLabel({
      text : answer.question().content + ": " + answer.contentForDisplay(),
      color : Palette.PRIMARY_COLOR,
      font : {
        fontSize : Measurements.FONT_MEDIUM
      }
    });
    view.add(label);
    if (answer.isImage()) {
      var imageView = Ti.UI.createImageView({
        width : 100,
        height : 100,
        image : answer.image
      });
      view.add(imageView);
    }
    identifierAnswersView.add(view);
  });

  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
  return (self);
}

module.exports = ResponseRowView;
