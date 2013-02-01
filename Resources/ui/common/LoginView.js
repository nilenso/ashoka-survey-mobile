var TopLevelView = require('ui/common/components/TopLevelView');
var ButtonView = require('ui/common/components/ButtonView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var loginHelper = require('helpers/LoginHelper');
var ConfirmDialog = require('ui/common/components/ConfirmDialog');
var Measurements = require('ui/common/components/Measurements');

function LoginView() {

  var topLevelView = new TopLevelView('Login');

  var self = Ti.UI.createView({
    layout : 'vertical',
    top : '120dip'
  });
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

  var rememberMeView = Ti.UI.createView({
    layout : 'horizontal',
    height : Titanium.UI.SIZE,
    width : '80%'
  });
  var size = Ti.Platform.displayCaps.platformHeight * 0.05;
  var rememberMeCheckbox = Ti.UI.createSwitch({
    value : false,
    style : Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
    height : size,
    width : size,
    left : Measurements.PADDING_X_SMALL,
    titleOn : "",
    titleOff : ""
  });
  var rememberMeLabel = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR,
    text : L('remember_me'),
    left : Measurements.PADDING_BIG,
    font : {
      fontSize : Measurements.FONT_MEDIUM
    }
  });

  var loginButton = new ButtonView('Login', {
    width : '60%'
  });

  var populateUserName = function() {
    var oldEmail = Ti.App.Properties.getString('email');
    var loggedIn = Ti.App.Properties.getString('loggedIn');
    if (oldEmail && loggedIn)
      emailField.setValue(oldEmail);
  }();

  self.add(emailField);
  self.add(passwordField);
  rememberMeView.add(rememberMeCheckbox);
  rememberMeView.add(rememberMeLabel);
  self.add(rememberMeView);
  self.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
  self.add(loginButton);

  loginButton.addEventListener('click', function() {
    var email = emailField.getValue().trim();
    var old_email = Ti.App.Properties.getString('email');
    var password = passwordField.getValue();
    var rememberMe = rememberMeCheckbox.getValue();

    if (old_email && (email.toLowerCase() !== old_email.toLowerCase())) {
      var confirmDialog = new ConfirmDialog(L("login_menu"), L("login_confirm_dialog"), onConfirm = function(e) {
        var DatabaseHelper = require("helpers/DatabaseHelper");
        DatabaseHelper.clearDownloadedData();
        loginHelper.login(email, password, rememberMe);
      });
      confirmDialog.show();
    } else {
      loginHelper.login(email, password, rememberMe);
    }
  });

  return topLevelView;
}

module.exports = LoginView;
