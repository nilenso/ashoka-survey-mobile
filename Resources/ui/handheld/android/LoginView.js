function LoginView() {

	var self = Ti.UI.createWindow({
		title : 'New Response',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	
	var username = Titanium.UI.createTextField({
		color : '#336699',
		top : 10,
		left : 10,
		width : 300,
		height : 40,
		hintText : 'Username',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	self.add(username);

	var password = Titanium.UI.createTextField({
		color : '#336699',
		top : 60,
		left : 10,
		width : 300,
		height : 40,
		hintText : 'Password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});

	self.add(password);

	var loginBtn = Titanium.UI.createButton({
		title : 'Login',
		top : 110,
		width : 90,
		height : 35,
		borderRadius : 1,
	});

	win.add(loginBtn);

	return win;
}

module.exports = LoginView;
