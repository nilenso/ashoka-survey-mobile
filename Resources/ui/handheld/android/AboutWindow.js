function AboutWindow() {
  try {
  var AboutView = require('ui/common/AboutView');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });

  var aboutView = new AboutView();
  self.add(aboutView);

  return self;
  }
  catch(e) {
    var auditor = require('helpers/Auditor');
    auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  }
}

module.exports = AboutWindow;
