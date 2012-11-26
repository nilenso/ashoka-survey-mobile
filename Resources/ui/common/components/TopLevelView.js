var HeaderView = require('ui/common/components/HeaderView');
var TopLevelView = function(title) {

  var self = Ti.UI.createView({
    height : Ti.UI.SIZE,
    layout : 'vertical'
  });

  self.add(new HeaderView(title));
  return self;
}

module.exports = TopLevelView;
