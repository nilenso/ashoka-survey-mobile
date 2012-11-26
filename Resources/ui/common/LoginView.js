function LoginView() {
	
	var loginUrl = Ti.App.Properties.getString('server_url') + '/api/login';
	
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
	
	loginButton.addEventListener('click', function(){
	  var email = emailField.getValue();
	  var password = passwordField.getValue();
	  var client = Ti.Network.createHTTPClient();
	  client.autoRedirect = false;
	  
	  client.onload = function() {
	    var cookie = this.getResponseHeader('Set-Cookie');
	    Ti.App.Properties.setString('auth_cookie', cookie);
      self.fireEvent('login:completed');
	  } 
	  
	  client.onerror = function() {
	    alert("Login failed, sorry!");
	  } 
	  client.open('POST', loginUrl);
	  client.send({
	    username: email,
	    password: password
	  });
	});
	
	
	return self;
}

module.exports = LoginView;
