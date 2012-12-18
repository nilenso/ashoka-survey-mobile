function ResponsesIndexWindow(surveyID) {
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
  var ResponseShowView = require('ui/common/responses/ResponseShowView');
  var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow');
  var Survey = require('models/survey');
  var progressBar = require('ui/common/components/ProgressBar');
  var loggedIn = require('helpers/LoginHelper').loggedIn;

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff",

    activity : {
      onCreateOptionsMenu : function(e) {
        var menu = e.menu;
        var menuItemSync = menu.add({
          title : "Sync",
          groupId : 1
        });

        menuItemSync.addEventListener('click', function() {
          view.syncResponses();
        });
        menuItemSync.setIcon("images/refresh.png");
      },

      onPrepareOptionsMenu : function(e) {
        var menu = e.menu;
        menu.setGroupEnabled(1, loggedIn());
      }
    }
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

  var syncHandler = function(data) {
    Ti.App.removeEventListener("survey.responses.sync", syncHandler);
    self.close();
    if (data.message)
    alert(data.message);
    else
    alert("successes: " + (data.successes || 0) + "\nerrors: " + (data.errors || 0));
  };
  Ti.App.addEventListener("survey.responses.sync", syncHandler);

  self.addEventListener('close', function() {
    Ti.App.removeEventListener("survey.responses.sync", syncHandler);
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

  view.addEventListener('close', function() {
      Ti.App.removeEventListener('ResponsesNewWindow:closed', view.refresh);
      Ti.App.removeEventListener('ResponseShowWindow:closed', view.refresh);
      Ti.App.removeEventListener('ResponseShowWindow:back', view.refresh);
  })

  return self;
}

module.exports = ResponsesIndexWindow;
