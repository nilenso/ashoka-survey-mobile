var SeparatorView = function(height, color) {

  var self = Ti.UI.createView({
    backgroundColor : color,
    height : height,
  });

  return self;
}

module.exports = SeparatorView;
