
var LoginHelper = {
  loggedIn : function() {
    var cookie = Ti.App.Properties.getString('auth_cookie');
    if (!cookie)
      return false;
    return true;
  },

  logout : function() {
    var createConfirmDialog = function() {
      var confirmDialog = Ti.UI.createAlertDialog({
        title : "Logout",
        cancel : 1,
        buttonNames : ['Confirm', 'Cancel'],
        message : "This will clear your surveys.\n Are you sure?"
      });
      return confirmDialog;
    }
    var confirmDialog = createConfirmDialog();
    confirmDialog.addEventListener('click', function(e) {
      if (e.index === e.source.cancel) {
        Ti.API.info('The logout was cancelled');
      } else {
        Ti.App.Properties.setString('auth_cookie', null);
        var DatabaseHelper = require("helpers/DatabaseHelper");
        DatabaseHelper.clearDownloadedData();
        Ti.App.fireEvent('settings.refreshSurveys');

      }
    });
    confirmDialog.show();
  }
}

module.exports = LoginHelper;
