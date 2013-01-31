var loggedIn = require('helpers/LoginHelper').loggedIn;
var loginHelper = require('helpers/LoginHelper');

var activityIndicator = Ti.UI.Android.createProgressIndicator({
  message : L('login_indicator'),
  location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
  type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
});

var NetworkHelper = {
  pingSurveyWebWithLoggedInCheck : function(success, error) {
    if (!loggedIn()) {
      var password = Ti.App.Properties.getString('password');
      var email = Ti.App.Properties.getString('email');
      if(password) {
        activityIndicator.show();
        loginHelper.login(email, password, true, function() { activityIndicator.hide(); success(); }, function() { activityIndicator.hide(); error(); });
      } else {
        if (error) {
          error.call();
        } else {
          alert(L("not_logged_in"));
        }
      }
      return;
    }
    NetworkHelper.pingSurveyWebWithoutLoggedInCheck(success, error);
  },

  pingSurveyWebWithoutLoggedInCheck : function(success, error) {
    if (!Titanium.Network.online) {
      if (error) {
        error.call();
      } else {
        Ti.App.fireEvent('network.offline');
        alert(L("network_offline"));
      }
      return;
    }
    var client = Ti.Network.createHTTPClient({
      onload : success,
      onerror : error ||
      function() {
        Ti.App.fireEvent('network.server.unreachable');
        alert(L("check_internet"));
      },
      timeout : 5000
    });

    client.open('HEAD', Ti.App.Properties.getString('server_url'));
    client.send();
  }
};

module.exports = NetworkHelper;
