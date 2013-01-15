function LoginWindow() {
	var LoginView = require('ui/common/LoginView');

	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : "#fff"
	});

	var loginView = new LoginView();
	self.add(loginView);

	loginView.addEventListener('login:completed', function() {
	  self.close();
	});

	self.addEventListener('close', function(){
		Ti.App.removeEventListener('network.server.unreachable', loginView.networkServerUnreachable);
		Ti.App.removeEventListener('network.offline', loginView.networkOffline);
		Ti.App.removeEventListener('login.done', loginView.loginDone);
	});

	return self;
}

module.exports = LoginWindow;
