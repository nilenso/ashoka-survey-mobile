var HeaderView = require('ui/common/components/HeaderView');
var TopLevelView = function(title) {

  var self = Ti.UI.createView();

  var header = new HeaderView(title);
  self.add(header);
  
  self.headerHeight = header.getHeight();
   
  return self;
}

module.exports = TopLevelView;
