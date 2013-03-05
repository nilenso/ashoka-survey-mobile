var HeaderView = function(title) {
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Measurements = require('ui/common/components/Measurements');

  var self = Ti.UI.createView({
    backgroundColor : Palette.PRIMARY_COLOR,
    height : '51dip',
    layout : 'vertical',
    bottom : Measurements.PADDING_BIG,
    top : Measurements.ZERO
  });

  var appNameContainer = Ti.UI.createView({
    top : Measurements.PADDING_X_SMALL,
    height : Ti.UI.SIZE
  });

  var loggedIn = require('helpers/LoginHelper').loggedIn;

  var logo = Ti.UI.createImageView({
    image : '/images/logo.png',
    left : Measurements.PADDING_SMALL,
    width : '30dip',
    height : '30dip',
    bottom : Measurements.PADDING_SMALL
  });

  var appName = Ti.UI.createLabel({
    color : Palette.SECONDARY_COLOR_LIGHT,
    font : {
      fontSize : Measurements.FONT_MEDIUM
    },
    left : '40dip',
    text : title,
    height : Ti.UI.SIZE
  });

  appNameContainer.add(logo);
  appNameContainer.add(appName);
  self.add(appNameContainer);

  var userDetailsView = Ti.UI.createView({
    backgroundColor : Palette.GRAY_LIGHT,
    width : '100%',
    height : Ti.UI.SIZE
  });

  var userNameLabel = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR_LIGHT,
    left : Measurements.PADDING_SMALL,
    text : "",
    font : {
      fontSize : Measurements.FONT_SMALL
    }
  });

  userDetailsView.add(userNameLabel);

  self.add(userDetailsView);

  var setUserName = function() {
    if (loggedIn()) {
      userNameLabel.text = L("logged_in_as") + Ti.App.Properties.getString('username');
    }
    else {
      userNameLabel.text = L("header_not_logged_in");
    }
  };

  self.updateUserName = function() {
    setUserName();
  };

  self.updateUserName();

  return self;
};

module.exports = HeaderView;
