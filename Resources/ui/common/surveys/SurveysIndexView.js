//SurveysIndexView Component Constructor
function SurveysIndexView() {
  var Survey = require('models/survey');
  var HeaderView = require('ui/common/components/HeaderView');
  var _ = require('lib/underscore')._;
  var TopLevelView = require('ui/common/components/TopLevelView');
  var progressBarView = require('ui/common/components/ProgressBar');
  var Palette = require('ui/common/components/Palette');
  var SurveyRowView = require('ui/common/surveys/SurveyRowView');

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

  progressBarView.addEventListener('sync:complete', function(e) {
    self.refresh();
    self.fireEvent('surveys.index.progress.finish');
    Ti.App.removeEventListener('surveys.fetch.error', errorListener);
  });

  var errorListener = function(data) {
    progressBarView.hide();
    progressBarView.reset();
    if (data.status >= 400) {
      alert("Your server isn't responding. Sorry about that.");
    } else if (data.status == 0) {
      alert("Couldn't reach the server.");
    }
    Ti.App.removeEventListener('surveys.fetch.error', errorListener);
  };

  self.addErrorListener = function() {
    Ti.App.addEventListener('surveys.fetch.error', errorListener);
  };

  var showProgressBar = function(e) {
    progressBarView.reset();
    self.add(progressBarView);
    progressBarView.show();
    self.fireEvent('surveys.index.progress.start');
    Ti.App.removeEventListener('surveys:fetch:start', showProgressBar);
    Ti.App.removeEventListener('all.responses.sync.start', showProgressBar);
  };

  Ti.App.addEventListener('surveys.fetch.start', showProgressBar);
  Ti.App.addEventListener('all.responses.sync.start', showProgressBar);

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
      fontSize : '20dip'
    },
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

  return self;
};

module.exports = SurveysIndexView;
