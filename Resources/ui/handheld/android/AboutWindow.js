function AboutWindow() {
  var AboutView = require('ui/common/AboutView');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });

  var aboutView = new AboutView();
  self.add(aboutView);

  return self;
}

module.exports = AboutWindow;
