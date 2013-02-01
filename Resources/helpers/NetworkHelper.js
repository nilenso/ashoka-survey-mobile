var loggedIn = require('helpers/LoginHelper').loggedIn;
var loginHelper = require('helpers/LoginHelper');
var activityIndicator = Ti.UI.Android.createProgressIndicator({
  message : L('reaching_server'),
  location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
  type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
});

var NetworkHelper = {
  pingSurveyWebWithLoggedInCheck : function(success, error) {
    if(loggedIn()) {
      NetworkHelper.pingSurveyWebWithoutLoggedInCheck(success, error);
      return;
    }
    var password = Ti.App.Properties.getString('password');
    var email = Ti.App.Properties.getString('email');
    if(password)
      loginHelper.login(email, password, true);
    else
      error ? error.call() : alert(L("not_logged_in"));
  },

  pingSurveyWebWithoutLoggedInCheck : function(success, error) {
    if(!this.networkOnlineCheck(error)) return;
    var client = Ti.Network.createHTTPClient({
      onload : function(){
        activityIndicator.hide();
        success();
      },
      onerror : function(){
        activityIndicator.hide();
        if(error) {
          error.call();
        } else {
          Ti.App.fireEvent('network.server.unreachable');
          alert(L("check_internet"));
        }
      },
      timeout : 5000
    });

    client.open('HEAD', Ti.App.Properties.getString('server_url'));
    client.send();

    activityIndicator.show();
  },

  networkOnlineCheck : function (error) {
    if (!Titanium.Network.online) {
      if (error) {
        error.call();
      } else {
        Ti.App.fireEvent('network.offline');
        alert(L("network_offline"));
      }
      return false;
    }
    return true;
  }
};

module.exports = NetworkHelper;
