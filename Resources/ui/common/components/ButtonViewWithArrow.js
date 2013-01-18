var Measurements = require('ui/common/components/Measurements');
var ButtonView = require('ui/common/components/ButtonView');
var _ = require('lib/underscore')._;

var ButtonViewWithArrow = function(title, options) {
  var options = options || {};

  var Palette = require('ui/common/components/Palette');

  var self = Ti.UI.createView(_.extend(options, {
    layout: 'horizontal',
    height: '50dip',
    width: '80%'
  }));

  var button = new ButtonView(title, options);
  var arrow = Ti.UI.createButton({
    title : '▼',
    backgroundColor : options.backgroundColor || Palette.PRIMARY_COLOR,
    backgroundSelectedColor : options.backgroundSelectedColor || Palette.PRIMARY_COLOR_LIGHT,
    backgroundFocusedColor : options.backgroundFocusedColor || Palette.PRIMARY_COLOR_LIGHT,
    backgroundDisabledColor : options.backgroundDisabledColor || Palette.GRAY_LIGHT,
    color : options.color || Palette.SECONDARY_COLOR_LIGHT,
    font : {
      fontSize : options.fontSize || Measurements.FONT_X_BIG },
    height : options.height || '40dip',
    right : '10dip'
  });

  self.add(button);
  self.add(arrow);

  self.setTitle = function(title) {
    button.setTitle(title);
  };

  return self;
};

module.exports = ButtonViewWithArrow;
