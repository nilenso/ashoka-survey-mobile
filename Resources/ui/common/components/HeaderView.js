var HeaderView = function(title) {
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');

  var self = Ti.UI.createView({
    backgroundColor : Palette.PRIMARY_COLOR,
    height : '70dip',
    layout : 'vertical',
    bottom : '10dip',
    top : '0dip'
  });

  var appNameContainer = Ti.UI.createView({
  	top : '10dip',
    height : Ti.UI.SIZE,
    layout : 'horizontal'
  });

  var logo = Ti.UI.createImageView({
    image : '/images/logo.png',
    left : '5dip',
    bottom : '5dip',
    height : Ti.UI.SIZE
  });

  var appName = Ti.UI.createLabel({
    color : Palette.SECONDARY_COLOR_LIGHT,
    font : {
      fontSize : '25dip',
      fontWeight : 'bold'
    },
    left : '10dip',
    text : title,
    height : Ti.UI.SIZE
  });

  appNameContainer.add(logo);
  appNameContainer.add(appName);
  self.add(appNameContainer);

  return self;
}

module.exports = HeaderView;
