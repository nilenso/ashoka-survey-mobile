var SeparatorView = function(color, height, options) {
  options = options || {};
  var self = Ti.UI.createView({
    backgroundColor : color,
    height : height,
    width : options.width || '100%'
  });

  return self;
};

module.exports = SeparatorView;
