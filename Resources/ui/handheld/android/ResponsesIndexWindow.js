function ResponsesIndexWindow(surveyID) {
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
  var ResponseShowView = require('ui/common/responses/ResponseShowView');
  var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow');
  var Survey = require('models/survey');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });

  var view = new ResponsesIndexView(surveyID);
  self.add(view);

  var activityIndicator = Ti.UI.Android.createProgressIndicator({
    message : 'Loading...',
    location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
    type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
  });
  self.add(activityIndicator);

  view.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
    activityIndicator.show();
    new ResponseShowWindow(e.responseID).open();
    activityIndicator.hide();
  });

  var disableBackButton = function() {
    // intentionally do nothing to block it
  };

  view.addEventListener('progress.start', function(e) {
    self.addEventListener('android:back', disableBackButton);
  });

  view.addEventListener('progress.finish', function(e) {
    self.removeEventListener('android:back', disableBackButton);
  });

  self.addEventListener("android:back", function(){
    Ti.App.removeEventListener('ResponseNewWindow:closed', view.refresh);
    Ti.App.removeEventListener('ResponseShowWindow:closed', view.refresh);
    Ti.App.removeEventListener('ResponseShowWindow:back', view.refresh);
    view.cleanup();
    view = null;
    self.close();
  });

  return self;
}

module.exports = ResponsesIndexWindow;
