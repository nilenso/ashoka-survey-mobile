var loggedIn = require('helpers/LoginHelper').loggedIn;

var NetworkHelper = {
  pingSurveyWebWithLoggedInCheck : function(success, error) {
    if (!loggedIn()) {
      if (error) {
        error.call();
      } else {
        alert("You aren't logged in.");
      }
      return;
    };

    NetworkHelper.pingSurveyWebWithoutLoggedInCheck(success, error);

  },

  pingSurveyWebWithoutLoggedInCheck : function(success, error) {
    if (!Titanium.Network.online) {
      if (error) {
        error.call();
      } else {
        Ti.App.fireEvent('network.offline');        
        alert("Network isn't online.");
      }
      return;
    };
    var client = Ti.Network.createHTTPClient({
      onload : success,
      onerror : error ||
      function() {
        Ti.App.fireEvent('network.server.unreachable');
        alert("Couldn't reach the server");
      },
      timeout : 5000
    });

    client.open('HEAD', Ti.App.Properties.getString('server_url'));
    client.send();
  }
}

module.exports = NetworkHelper;
