var Measurements = require('ui/common/components/Measurements');

var ButtonView = function(title, options) {
  var options = options || {};

  var Palette = require('ui/common/components/Palette');

  var self = Ti.UI.createButton({
    title : title,
    backgroundColor : options.backgroundColor || Palette.PRIMARY_COLOR,
    backgroundSelectedColor : options.backgroundSelectedColor || Palette.PRIMARY_COLOR_LIGHT,
    backgroundFocusedColor : options.backgroundFocusedColor || Palette.PRIMARY_COLOR_LIGHT,
    backgroundDisabledColor : options.backgroundDisabledColor || Palette.GRAY_LIGHT,
    color : options.color || Palette.SECONDARY_COLOR_LIGHT,
    width : options.width || '80%',
    font : {
      fontSize : options.fontSize || Measurements.FONT_MEDIUM },
    enabled : options.enabled === undefined ? true : options.enabled,
    height : options.height || '40dip',
    left : options.left,
    right : options.right,
    borderRadius : options.borderRadius || 0
  });

  return self;
};

module.exports = ButtonView;
