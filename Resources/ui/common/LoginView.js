var TopLevelView = require('ui/common/components/TopLevelView');
var NetworkHelper = require('helpers/NetworkHelper');
var ButtonView = require('ui/common/components/ButtonView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var Toast = require('ui/common/components/Toast');

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

  var loginButton = new ButtonView('Login', { width : '60%'});

  var activityIndicator = Ti.UI.createActivityIndicator({
    message : 'Logging in...',
    height : 'auto',
    width : 'auto'
  });
  Ti.App.addEventListener('network.server.unreachable', function(){
    activityIndicator.hide();
  });
  Ti.App.addEventListener('network.offline', function(){
    activityIndicator.hide();
  });

  self.add(activityIndicator);
  self.add(emailField);
  self.add(passwordField);
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
  self.add(loginButton);

  loginButton.addEventListener('click', function() {
    activityIndicator.show();
    NetworkHelper.pingSurveyWebWithoutLoggedInCheck( onSuccess = function() {
      var email = emailField.getValue().trim();
      var password = passwordField.getValue();
      var client = Ti.Network.createHTTPClient();
      client.autoRedirect = false;

      client.onload = function() {
        activityIndicator.hide();
        var response = JSON.parse(this.responseText);
        (new Toast('Logged in successfully as '+ response.username)).show();
        Ti.App.Properties.setString('access_token', response.access_token);
        Ti.App.Properties.setString('access_token_created_at', new Date().toString());
        Ti.API.info(response.username);
        Ti.App.Properties.setString('username', response.username);
        Ti.App.Properties.setString('user_id', response.user_id);
        topLevelView.fireEvent('login:completed');
      };

      client.onerror = function() {
        activityIndicator.hide();
        alert("Login failed, sorry!");
      };
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
