var HeaderView = function(title) {
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');

  var coloredPadding = new SeparatorView(Palette.PRIMARY_COLOR, '10dip');

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
    top : '10dip',
    height : Ti.UI.SIZE,
  });

  var loggedIn = require('helpers/LoginHelper').loggedIn;

  var logo = Ti.UI.createImageView({
    image : '/images/logo.png',
    left : '5dip',
    width : '50dip',
    height : '50dip',
    bottom : '5dip',
    height : Ti.UI.FILL
  });

  var appName = Ti.UI.createLabel({
    color : Palette.SECONDARY_COLOR_LIGHT,
    font : {
      fontSize : '25dip',
      fontWeight : 'bold'
    },
    left : '60dip',
    text : title,
    height : Ti.UI.SIZE
  });

  var usernameView = Ti.UI.createLabel({
    color : Palette.GRAY_LIGHT,
    right : '10dip',
    text : "",
    font : {
      fontSize : '15dip',
    },
    height : Ti.UI.SIZE
  });
  if (isTablet) {
    appNameContainer.add(usernameView);
  }

  appNameContainer.add(logo);
  appNameContainer.add(appName);
  self.add(appNameContainer);

  self.updateUserName = function() {
    Ti.API.info("HGASD");
    Ti.API.info(loggedIn());

    //var loggedIn = require('helpers/LoginHelper').loggedIn;
    if (loggedIn()) {
      usernameView.text = "Hi, " + Ti.App.Properties.getString('username') + "!";
    } else {
      usernameView.text = "";
    }
  };

  return self;
};

module.exports = HeaderView;
