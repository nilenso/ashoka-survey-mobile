var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');
var TableHeaderView = function(title) {
  var self = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR,
    font : {
      fontSize : Measurements.FONT_MEDIUM,
      fontWeight : 'bold'
    },
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    text : title,
    height : Measurements.TABLE_HEADER_HEIGHT,
    width : '100%'
  });

  return self;
};

module.exports = TableHeaderView;
