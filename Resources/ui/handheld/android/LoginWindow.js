function LoginWindow() {
	var LoginView = require('ui/common/LoginView');
	
	var self = Ti.UI.createWindow({
		title : 'Login',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	
	var loginView = new LoginView();
	self.add(loginView);
	
	loginView.addEventListener('login:completed', function() {
	  self.close();
	});
	
	return self;
}

module.exports = LoginWindow;