function SettingsWindow() {
  var SettingsView = require('ui/common/SettingsView');

  var self = Ti.UI.createWindow({
    title : 'Settings',
    navBarHidden : false,
    backgroundColor : "#fff"
  });

  var settingsView = new SettingsView();
  self.add(settingsView);

  settingsView.addEventListener('settings_saved', function() {
    self.close();
  });

  return self;
}

module.exports = SettingsWindow;
