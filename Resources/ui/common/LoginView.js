function LoginView() {
	
	var loginUrl = Ti.App.Properties.getString('server_url') + '/auth/user_owner';
	var self = Titanium.UI.createView({
		layout : 'vertical'
	});
	
	var emailField = Ti.UI.createTextField({
		width : '80%',
		hintText : 'Email',
		top : 20
	});
	
	var passwordField = Ti.UI.createTextField({
		width : '80%',
		hintText : 'Password',
		passwordMask : true
	});
	
	var loginButton = Ti.UI.createButton({
		width : '60%',
		title : 'Login'
	});
	
	self.add(emailField);
	self.add(passwordField);
	self.add(loginButton);
	
	
	return self;
}

module.exports = LoginView;
