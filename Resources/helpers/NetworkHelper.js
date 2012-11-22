var NetworkHelper = {
  pingSurveyWeb : function(success, error) {
    if(!Titanium.Network.online){
      error && error.call();
      return;
    };
    
    var client = Ti.Network.createHTTPClient({
      onload : success,
      onerror : error || function(){
        alert("Couldn't reach the server");
      },
      timeout : 5000
    });
    
    client.open('HEAD', Ti.App.Properties.getString('server_url'));
    client.send();
  }
}

module.exports = NetworkHelper;
