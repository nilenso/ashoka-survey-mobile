function ResponsesIndexWindow(surveyID) {
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
  var ResponseShowView = require('ui/common/responses/ResponseShowView')
  var ResponseShowWindow = require('ui/handheld/android/ResponseShowWindow')
  var SurveyDetailsWindow = require('ui/handheld/android/SurveyDetailsWindow')
  var Survey = require('models/survey');
  var NetworkHelper = require('helpers/NetworkHelper');
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
          survey = Survey.findOneById(surveyID)
          NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
            survey.syncResponses();
          });
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

  view.addEventListener('ResponsesIndexView:table_row_clicked', function(e) {
    new ResponseShowWindow(e.responseID).open();
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

  return self;
}

module.exports = ResponsesIndexWindow;
