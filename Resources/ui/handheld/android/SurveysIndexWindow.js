//Application Window Component Constructor
function SurveysIndexWindow() {
  try {
    //load component dependencies
    var SurveysIndexView = require('ui/common/surveys/SurveysIndexView');
    var SettingsWindow = require('ui/handheld/android/SettingsWindow');
    var AboutWindow = require('ui/handheld/android/AboutWindow');
    var Survey = require('models/survey');
    var Question = require('models/question');
    var ResponsesIndexWindow = require('ui/handheld/android/ResponsesIndexWindow');
    var ResponsesNewWindow = require('ui/handheld/android/ResponsesNewWindow');
    var loginWindow = require('ui/handheld/android/LoginWindow');
    var surveysIndexView = new SurveysIndexView();
    var loggedIn = require('helpers/LoginHelper').loggedIn;
    var loginHelper = require('helpers/LoginHelper');
    var progressBarView = require("ui/common/components/ProgressBar");
    var Toast = require('ui/common/components/Toast');
    var SyncHandler = require('models/syncHandler');

    //ID Constants

    var FETCH_SURVEYS = 1;
    var SYNC_RESPONSES = 2;

    var LOGIN = 42;
    var LOGOUT = 43;

    //create component instance
    var self = Ti.UI.createWindow({
      backgroundColor : '#fff',
      navBarHidden : true,
      exitOnClose : true,
      activity : {
        onCreateOptionsMenu : function(e) {
          var menu = e.menu;
          var menuItemFetch = menu.add({
            title : L("fetch_surveys_menu")
          });

          menuItemFetch.addEventListener('click', surveysIndexView.fetchAllSurveys);
          menuItemFetch.setIcon("/images/fetch.png");

          var menuItemSync = menu.add({
            title : L("sync_responses_menu"),
            groupId : SYNC_RESPONSES
          });

          menuItemSync.addEventListener('click', function(){
            surveysIndexView.syncAllResponses();
            var auditor = require('helpers/Auditor');
            auditor.sendAuditFile();
          });

          menuItemSync.setIcon("/images/refresh.png");

          var login = menu.add({
            title : L("login_menu"),
            groupId : LOGIN
          });
          login.addEventListener('click', function() {
            new loginWindow().open();
          });
          login.setIcon("/images/login.png");

          var logout = menu.add({
            title : L("logout_menu"),
            groupId : LOGOUT
          });
          logout.setIcon("/images/logout.png");
          logout.addEventListener('click', function() {
            loginHelper.logout();
          });

          var menuItemSettings = menu.add({
            title : L("settings_menu")
          });
          menuItemSettings.addEventListener('click', function() {
            new SettingsWindow().open();
          });
          menuItemSettings.setIcon("/images/settings.png");

          var menuItemAbout = menu.add({
            title : L("about")
          });
          menuItemAbout.addEventListener('click', function() {
            new AboutWindow().open();
          });
          menuItemAbout.setIcon("/images/about.png");
        },

        onPrepareOptionsMenu : function(e) {
          var menu = e.menu;
          menu.setGroupEnabled(SYNC_RESPONSES, (Survey.allResponsesCount() !== 0));
          // Allow syncing responses if there is any survey with responses in the DB.

          menu.setGroupVisible(LOGIN, !loggedIn());
          //Remove the Login button
          menu.setGroupVisible(LOGOUT, loggedIn());
          //Remove the Logout button
        }
      }
    });

    var activityIndicator = Ti.UI.Android.createProgressIndicator({
      message : L('activity_indicator'),
      location : Ti.UI.Android.PROGRESS_INDICATOR_DIALOG,
      type : Ti.UI.Android.PROGRESS_INDICATOR_INDETERMINANT
    });
    self.add(activityIndicator);

    surveysIndexView.addEventListener('surveys_index_view.table_row_clicked', function(e) {
      activityIndicator.show();
      ResponsesIndexWindow(e.surveyID).open();
      activityIndicator.hide();
    });

    surveysIndexView.addEventListener('surveys_index_view.add_response_clicked', function(e) {
      activityIndicator.show();
      Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
      var location = require('helpers/Location');
      var surveyID = e.surveyID;
      location.start({
        action: function(responseLocation) { 
          ResponsesNewWindow(surveyID, responseLocation).open();
          activityIndicator.hide();
        },
        error: function() { 
          ResponsesNewWindow(surveyID, {}).open();
          activityIndicator.hide();
          alert(L("location_not_found"));
        }
      });
    });

    var disableBackButton = function() {
      // intentionally do nothing to block it
    };

    surveysIndexView.addEventListener('progress.start', function(e) {
      self.addEventListener('android:back', disableBackButton);
    });

    surveysIndexView.addEventListener('progress.finish', function(e) {
      self.removeEventListener('android:back', disableBackButton);
    });

    self.addEventListener('focus', function() {
      surveysIndexView.refresh();
    });
    //construct UI
    self.add(surveysIndexView);

    return self;
  }
  catch(e) {
    var auditor = require('helpers/Auditor');
    auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  }
}

//make constructor function the public component interface
module.exports = SurveysIndexWindow;
