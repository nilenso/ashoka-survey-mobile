var ButtonView = function(title) {
  var Palette = require('ui/common/components/Palette');
  
  var self = Ti.UI.createButton({
    title : title,
    backgroundColor : Palette.PRIMARY_COLOR,
    backgroundSelectedColor : Palette.PRIMARY_COLOR_LIGHT,
    backgroundFocusedColor : Palette.PRIMARY_COLOR_LIGHT,
    color : Palette.SECONDARY_COLOR_LIGHT,
    width : '80%',
    font : {
      fontSize : '20dip'
    },
    height : '30dip'
  });

  return self;
}

module.exports = ButtonView;
