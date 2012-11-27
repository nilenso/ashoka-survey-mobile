var TopLevelView = require('ui/common/components/TopLevelView');
var NetworkHelper = require('helpers/NetworkHelper');

function LoginView() {
  
  var loginUrl = Ti.App.Properties.getString('server_url') + '/api/login';

  var topLevelView = new TopLevelView('Login');
  
  var self = Ti.UI.createView({
    layout : 'vertical',
    top : '120dip'
  })
  topLevelView.add(self);

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

  loginButton.addEventListener('click', function() {
    NetworkHelper.pingSurveyWebWithoutLoggedInCheck( onSuccess = function() {
      var email = emailField.getValue().trim();
      var password = passwordField.getValue();  
      var client = Ti.Network.createHTTPClient();
      client.autoRedirect = false;

      client.onload = function() {
        var response = JSON.parse(this.responseText);
        Ti.App.Properties.setString('access_token', response.access_token);
        Ti.App.Properties.setString('access_token_created_at', new Date().toString());
        topLevelView.fireEvent('login:completed');
      }

      client.onerror = function() {
        alert("Login failed, sorry!");
      }
      client.open('POST', loginUrl);
      client.send({
        username : email,
        password : password
      });
    });
  });

  return topLevelView;
}

module.exports = LoginView;
