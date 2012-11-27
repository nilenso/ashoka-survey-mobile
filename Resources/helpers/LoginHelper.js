var LoginHelper = {
  loggedIn : function() {
    var cookie = Ti.App.Properties.getString('auth_cookie');
    if(!cookie) return false;
    return true;
  }
}

module.exports = LoginHelper;
