
var LoginHelper = {
  loggedIn : function() {
    var cookie = Ti.App.Properties.getString('auth_cookie');
    var cookieCreatedAt = Ti.App.Properties.getString('auth_cookie_created_at');
    
    if (!cookie)
      return false;
      
    if(new Date() - new Date(cookieCreatedAt) > 3600000) { //Expire the cookie after 1 hour.
      alert("Your session has expired. You need to login again to fetch or sync any data.");
      LoginHelper.expireSession();
      return false;  
    }
        
    return true;
  },

  logout : function(clearDB) {
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
        LoginHelper.expireSession();
        var DatabaseHelper = require("helpers/DatabaseHelper");
        DatabaseHelper.clearDownloadedData();
        Ti.App.fireEvent('settings.refreshSurveys');

      }
    });
    confirmDialog.show();
  },
  
  expireSession : function() {
    Ti.App.Properties.setString('auth_cookie', null);
    Ti.App.Properties.setString('auth_cookie_created_at', null); 
  }
  
}

module.exports = LoginHelper;
