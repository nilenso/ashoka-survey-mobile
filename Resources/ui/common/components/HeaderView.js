var HeaderView = function(title) {
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Measurements = require('ui/common/components/Measurements');

  var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;
  var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

  var self = Ti.UI.createView({
    backgroundColor : Palette.PRIMARY_COLOR,
    height : '56dip',
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

  var loginStatusView = Ti.UI.createLabel({
    right : Measurements.PADDING_BIG,
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

  var userStatusLabel = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR_LIGHT,
    right : Measurements.PADDING_MEDIUM,
    text : "",
    font : {
      fontSize : Measurements.FONT_SMALL
    }
  });

  userDetailsView.add(userNameLabel);
  userDetailsView.add(userStatusLabel);

  self.add(userDetailsView);

  var setUserName = function() {
    if (loggedIn()) {
      userNameLabel.text = "Logged in as " + Ti.App.Properties.getString('username');
    }
    else {
      userNameLabel.text = "Not logged in";
    }
  };

  var setUserStatus = function() {
    if (Ti.App.Properties.getString('email')) {
      if (loggedIn()) {
        userStatusLabel.text = "Online";
      } else {
        userStatusLabel.text = "Offline";
      }
    }
    else {
      userStatusLabel.text = "";
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
    setUserStatus();
  };

  self.updateUserName();

  return self;
};

module.exports = HeaderView;
