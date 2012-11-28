var ConfirmDialog = require('ui/common/components/ConfirmDialog');
var LoginHelper = {
  loggedIn : function() {
    var accessToken = Ti.App.Properties.getString('access_token');
    var accessTokenCreatedAt = Ti.App.Properties.getString('access_token_created_at');

    if (!accessToken)
      return false;

    if (new Date() - new Date(accessTokenCreatedAt) > 3600000) {//Expire the token after 1 hour.
      alert("Your session has expired. You need to login again to fetch or sync any data.");
      LoginHelper.expireSession();
      return false;
    }

    return true;
  },

  logout : function(clearDB) {
    var confirmDialog = new ConfirmDialog("Logout", "This will clear your surveys.\n Are you sure?", onConfirm = function(e) {
      LoginHelper.expireSession();
      var DatabaseHelper = require("helpers/DatabaseHelper");
      DatabaseHelper.clearDownloadedData();
      Ti.App.fireEvent('settings.refreshSurveys');
    });
    confirmDialog.show();
  },

  expireSession : function() {
    Ti.App.Properties.setString('access_token', null);
    Ti.App.Properties.setString('access_token_created_at', null);
  }
}

module.exports = LoginHelper;
