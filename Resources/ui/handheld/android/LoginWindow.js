function LoginWindow() {
	try {
	var LoginView = require('ui/common/LoginView');

	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : "#fff"
	});

	var loginView = new LoginView();
	self.add(loginView);

  var closeWindow = function() {
    Ti.App.removeEventListener('login:completed', closeWindow);
    self.close();
  };
  Ti.App.addEventListener('login:completed', closeWindow);

	self.addEventListener('close', function(){
		Ti.App.removeEventListener('network.server.unreachable', loginView.networkServerUnreachable);
		Ti.App.removeEventListener('network.offline', loginView.networkOffline);
		Ti.App.removeEventListener('login.done', loginView.loginDone);
	});

	return self;
  }
  catch(e) {
    var auditor = require('helpers/Auditor');
    auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  }
}

module.exports = LoginWindow;
