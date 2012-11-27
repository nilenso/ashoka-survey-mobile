var SeparatorView = function(color, height) {

  var self = Ti.UI.createView({
    backgroundColor : color,
    height : height,
  });

  return self;
}

module.exports = SeparatorView;
