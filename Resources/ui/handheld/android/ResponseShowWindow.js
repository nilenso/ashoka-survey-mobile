function ResponseShowWindow(responseID) {
  try {
  var ResponseShowView = require('ui/common/responses/ResponseShowView');
  var ResponseEditWindow = require('ui/handheld/android/ResponseEditWindow');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });
  var view = new ResponseShowView(responseID);
  self.add(view);

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : L('activity_indicator'),
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
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
    if (view)
      view.cleanup();
    view = null;
    self.close();
    Ti.App.fireEvent('ResponseShowWindow:back');
  });

  return self;
  }
  catch(e) {
    var auditor = require('helpers/Auditor');
    auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  }
}

module.exports = ResponseShowWindow;
