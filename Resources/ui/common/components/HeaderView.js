var HeaderView = function(title) {
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Measurements = require('ui/common/components/Measurements');

  var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
  var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

  var self = Ti.UI.createView({
    backgroundColor : Palette.PRIMARY_COLOR,
    height : '60dip',
    layout : 'vertical',
    bottom : '10dip',
    top : '0dip'
  });

  var appNameContainer = Ti.UI.createView({
    top : '5dip',
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

  var loginStatusView = Ti.UI.createLabel({
    right : '10dip',
    text : "●",
    font : {
      fontSize : Measurements.FONT_X_BIG
    },
    height : Ti.UI.SIZE
  });
  appNameContainer.add(loginStatusView);

  appNameContainer.add(logo);
  appNameContainer.add(appName);
  self.add(appNameContainer);

  var userNameLabel = Ti.UI.createLabel({
    backgroundColor : Palette.GRAY_LIGHT,
    height : Ti.UI.SIZE,
    color : Palette.PRIMARY_COLOR_LIGHT,
    text : "",
    width : '100%',
    font : {
      fontSize : Measurements.FONT_SMALL
    }
  });

  self.add(userNameLabel);

  var setUserName = function() {
    if (loggedIn()) {
      userNameLabel.text = "Logged in as " + Ti.App.Properties.getString('username');
    } else {
      userNameLabel.text = "Not logged in";
    }
  };

  var setLoginStatus = function() {
    if (Ti.App.Properties.getString('email')) {
      if (loggedIn()) {
        loginStatusView.color = Palette.GREEN;
      } else {
        loginStatusView.color = Palette.GRAY;
      }
    }
    else {
      loginStatusView.color = Palette.RED;
    }
  };

  self.updateUserName = function() {
    setLoginStatus();
    setUserName();
  };

  setLoginStatus();
  setUserName();

  return self;
};

module.exports = HeaderView;
