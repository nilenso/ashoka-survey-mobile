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
        alert("Network isn't online.");
        Ti.App.fireEvent('network.offline');        
      }
      return;
    };
    var client = Ti.Network.createHTTPClient({
      onload : success,
      onerror : error ||
      function() {
        alert("Couldn't reach the server");
        Ti.App.fireEvent('network.server.unreachable');
      },
      timeout : 5000
    });

    client.open('HEAD', Ti.App.Properties.getString('server_url'));
    client.send();
  }
}

module.exports = NetworkHelper;
