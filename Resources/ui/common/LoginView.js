function LoginView() {
	
	var loginUrl = Ti.App.Properties.getString('server_url') + '/auth/user_owner';
	var self = Titanium.UI.createWebView({ url : loginUrl });

	return self;
}

module.exports = LoginView;
