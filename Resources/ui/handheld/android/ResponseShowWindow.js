function ResponseShowWindow(responseID) {
  var ResponseShowView = require('ui/common/responses/ResponseShowView');
  var ResponseEditWindow = require('ui/handheld/android/ResponseEditWindow');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });
  var view = new ResponseShowView(responseID);
  self.add(view);

  var activityIndicator = Ti.UI.createActivityIndicator({
    message : 'Loading...'
  });
  self.add(activityIndicator);

  view.addEventListener('ResponseShowView:responseEdit', function(e) {
    activityIndicator.show();
    new ResponseEditWindow(e.responseID).open();
    activityIndicator.hide();
  });

  view.addEventListener('ResponseShowView:responseDeleted', function(e) {
    self.close();
    Ti.App.fireEvent('ResponseShowWindow:closed');
  });

  self.addEventListener('android:back', function() {
    Ti.App.fireEvent('ResponseShowWindow:back');
    self.close();
  });

  return self;
}

module.exports = ResponseShowWindow;
