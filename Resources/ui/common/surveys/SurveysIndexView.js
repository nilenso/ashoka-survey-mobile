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

  var convertModelDataForTable = function() {
    return _(Survey.all()).map(function(survey) {
      return new SurveyRowView(survey);
    });
  };
  var showMessageIfModelIsEmpty = function() {
    if (Survey.isEmpty()) {
      self.add(label);
      self.remove(table);
    } else {
      self.remove(label);
      self.add(table);
    }
  };
  var self = new TopLevelView('List of Surveys');

  var progressComplete = function(entityBeingSynced) {
    self.refresh();
    self.remove(progressBarView);
    Ti.API.info("Entity being fetched : " + entityBeingSynced);
    if (entityBeingSynced)
      (new Toast('Successfully fetched surveys')).show();
    self.fireEvent('progress.finish');
    Ti.App.removeEventListener('surveys.fetch.error', errorListener);
    progressBarView.removeEventListener('sync.complete', progressComplete);
  };

  var progressSurveysComplete = function(e) {
    progressComplete('surveys');
  };

  var progressResponsesComplete = function(e) {
    progressComplete();
  };

  self.addResponsesProgressCompleteListener = function() {
    progressBarView.addEventListener('sync.complete.responses', progressResponsesComplete);
  };

  self.addSurveysProgressCompleteListener = function() {
    progressBarView.addEventListener('sync.complete.surveys', progressSurveysComplete);
  };

  var errorListener = function(data) {
    progressBarView.hide();
    self.remove(progressBarView);
    if (data.status >= 400) {
      alert("Your server isn't responding. Sorry about that.");
    } else if (data.status === 0) {
      alert("Couldn't reach the server.");
    }
    Ti.App.removeEventListener('surveys.fetch.error', errorListener);
  };

  self.addErrorListener = function() {
    Ti.App.addEventListener('surveys.fetch.error', errorListener);
  };

  var showResponsesProgressBar = function(e) {
    self.fireEvent('progress.start');
    self.add(progressBarView);
    progressBarView.init('sync.complete.responses');
  };

  var showSurveyProgressBar = function(e) {
    self.fireEvent('progress.start');
    self.add(progressBarView);
    progressBarView.init('sync.complete.surveys');
  };

  Ti.App.addEventListener('surveys.fetch.start', showSurveyProgressBar);
  Ti.App.addEventListener('all.responses.sync.start', showResponsesProgressBar);

  var table = Titanium.UI.createTableView({
    separatorColor : 'transparent',
    top : self.headerHeight,
    data : convertModelDataForTable()
  });

  table.addEventListener('click', function(e) {
    self.fireEvent('surveys_index_view.table_row_clicked', {
      surveyID : e.rowData.surveyID
    });
  });

  label = Ti.UI.createLabel({
    color : '#333',
    font : {
      fontSize : Measurements.FONT_BIG    },
    text : 'Nothing here yet. Please fetch surveys from the menu.',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    top : '40%',
    width : 'auto',
    height : 'auto'
  });

  showMessageIfModelIsEmpty();

  self.refresh = function() {
    var data = convertModelDataForTable();
    table.setData(data);
    showMessageIfModelIsEmpty();
    self.updateUserName();
  };
  Ti.App.addEventListener('settings.refreshSurveys', self.refresh);

  var showSyncSummary = function(data) {
    alert((data.successes || 0) + " surveys successfully synced.\n" + (data.errors || 0) + " surveys' sync failed.");
  };
  Ti.App.addEventListener('all.responses.sync.complete', showSyncSummary);

  return self;
};

module.exports = SurveysIndexView;
