//SurveysIndexView Component Constructor
function SurveysIndexView() {
  var Survey = require('models/survey');
  var HeaderView = require('ui/common/components/HeaderView');
  var _ = require('lib/underscore')._;
  var TopLevelView = require('ui/common/components/TopLevelView');
  var progressBarView = require('ui/common/components/ProgressBar');
  var Palette = require('ui/common/components/Palette');
  var SurveyRowView = require('ui/common/surveys/SurveyRowView');
  var Toast = require('ui/common/components/Toast');
  var Measurements = require('ui/common/components/Measurements');
  var SyncHandler = require('models/syncHandler');

  var self = new TopLevelView(L('list_of_surveys'));

  var convertModelDataForTable = function() {
    if (table) {
      _(table.getChildren()).each(function(childView) {
        table.remove(childView);
      });
    }
    _(Survey.allSurveys()).map(function(survey) {
      var row = new SurveyRowView(survey);
      row.addEventListener('surveys_row_view.row_clicked', function() {
        self.fireEvent('surveys_index_view.table_row_clicked', {
          surveyID : survey.id
        });
      });
      row.addEventListener('surveys_row_view.add_response_clicked', function() {
        self.fireEvent('surveys_index_view.add_response_clicked', {
          surveyID : survey.id
        });
      });
      table.add(row);
    });
    self.add(table);
  };

  var showMessageIfTableIsEmpty = function() {
    if (Survey.isEmpty()) {
      setMessageWhenEmpty();
      self.add(label);
      self.remove(table);
    } else {
      self.remove(label);
      convertModelDataForTable();
    }
  };

  var progressComplete = function(entityBeingSynced) {
    self.refresh();
    self.remove(progressBarView);
    Ti.API.info("Entity being fetched : " + entityBeingSynced);
    if (entityBeingSynced)
      (new Toast(L('successfully_fetched_surveys'))).show();
    self.fireEvent('progress.finish');
  };

  var errorListener = function(data) {
    if (data.status >= 400) {
      alert(L("server_not_responding"));
    } else if (data.status === 0) {
      Survey.truncate();
      if(!progressBarView.isHidden()) {
        alert(L("survey_fetch_error"));
        self.refresh();
      }
    }
    progressBarView.hideView();
    self.remove(progressBarView);
  };

  var progressSurveyComplete = function(){
    progressComplete('surveys');
    progressBarView.removeEventListener('surveys.sync.completed', progressSurveyComplete);
  };

  self.fetchAllSurveys = function() {
    var progressBar = progressBarView;
    self.add(progressBar);
    progressBar.addEventListener('surveys.sync.completed', progressSurveyComplete);
    progressBar.init('surveys.sync.completed', 1.0);
    progressBar.setMessage(L("fetching_surveys"));
    Survey.fetchSurveys(new SyncHandler(progressBar.setValue, function(){}, errorListener));
  };

  var table = Titanium.UI.createScrollView({
    top : self.headerHeight,
    height : Ti.UI.SIZE,
    layout : 'vertical'
  });

  var setMessageWhenEmpty = function() {
    var loggedIn = Ti.App.Properties.getString('loggedIn');
    if(loggedIn === 'true')
      label.text =  L("logged_in");
    else
      label.text =  L("not_logged_in");
  };

  var label = Ti.UI.createLabel({
    color : '#333',
    font : {
      fontSize : Measurements.FONT_BIG    },
      text : "",
      textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
      top : '40%',
      width : 'auto',
      height : 'auto'
  });

  showMessageIfTableIsEmpty();

  self.refresh = function() {
    showMessageIfTableIsEmpty();
    self.updateUserName();
  };
  Ti.App.addEventListener('settings.refreshSurveys', self.refresh);

  var showSyncSummary = function(data) {
    alert((data.successes || 0) + L("surveys_sync_success") + (data.errors || 0) + L("surveys_sync_failed"));
  };

  self.syncAllResponses = function() {
    var progressBar = progressBarView;
    self.add(progressBar);
    progressBar.init('sync.complete.response', Survey.allResponsesCount());
    progressBar.setMessage(L("sync_responses"));
    Survey.syncAllResponses(new SyncHandler(progressBar.incrementValue, function(data) { showSyncSummary(data); progressComplete(); }));
  };

  return self;
}

module.exports = SurveysIndexView;
