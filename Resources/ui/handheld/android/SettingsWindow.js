function SettingsWindow() {
  // try {
    var SettingsView = require('ui/common/SettingsView');
    var self = Ti.UI.createWindow({
      navBarHidden : true,
      backgroundColor : "#fff"
    });

    var settingsView = new SettingsView();
    self.add(settingsView);

    settingsView.addEventListener('settings_saved', function() {
      self.close();
    });

    return self;
  // }
  // catch(e) {
  //   var auditor = require('helpers/Auditor');
  //   auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  // }
}

module.exports = SettingsWindow;
