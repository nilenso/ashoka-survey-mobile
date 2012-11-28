var HeaderView = require('ui/common/components/HeaderView');
var Palette = require('ui/common/components/Palette');

var TopLevelView = function(title) {

  var self = Ti.UI.createView({
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
  });


  var headerView = new HeaderView(title);
  self.headerHeight = headerView.getHeight();
  self.add(headerView);

  self.updateUserName = function() {
    headerView.updateUserName();
  };
  return self;
};

module.exports = TopLevelView;
