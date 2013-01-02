var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');
var TableHeaderView = function(title) {
  var self = Ti.UI.createLabel({
    backgroundColor : Palette.PRIMARY_COLOR,
    color : Palette.SECONDARY_COLOR_LIGHT,
    font : {
      fontSize : Measurements.FONT_MEDIUM
    },
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    text : title,
    height : Measurements.TABLE_HEADER_HEIGHT
  });

  return self;
};

module.exports = TableHeaderView;
