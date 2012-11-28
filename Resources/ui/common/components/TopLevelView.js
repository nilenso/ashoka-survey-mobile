var HeaderView = require('ui/common/components/HeaderView');
var TopLevelView = function(title) {

  var self = Ti.UI.createView();

  self.headerHeight = header.getHeight();

  var headerView = new HeaderView(title);
  self.add(headerView);

  self.updateUserName = function() {
    headerView.updateUserName();
  }
  return self;
}

module.exports = TopLevelView;
