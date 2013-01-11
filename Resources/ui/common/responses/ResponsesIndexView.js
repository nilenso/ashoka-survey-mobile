//ResponsesIndexView Component Constructor
function ResponsesIndexView(surveyID) {
  var _ = require('lib/underscore')._;
  var Response = require('models/response');
  var Survey = require('models/survey');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var progressBarView = require('ui/common/components/ProgressBar');
  var TableHeaderView = require('ui/common/components/TableHeaderView');
  var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView');
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Measurements = require('ui/common/components/Measurements');
  var NetworkHelper = require('helpers/NetworkHelper');
  var SyncHandler = require('models/syncHandler');
  var ResponseRowView = require('ui/common/responses/ResponseRowView');

  var survey = Survey.findOneById(surveyID);

  var convertModelDataForTable = function() {
    var responses = survey.responsesForCurrentUser();

    var incompleteSection = Ti.UI.createTableViewSection({ headerView : new TableHeaderView('Incomplete Responses') });
    var completeSection = Ti.UI.createTableViewSection({ headerView : new TableHeaderView('Complete Responses') });

    _(responses).map(function(response) {
      var row = new ResponseRowView(response);

      if(response.status === 'complete') {
        completeSection.add(row);
      } else {
        incompleteSection.add(row);
      }
    });
    var sections = [];
    if (incompleteSection.rowCount !== 0)
      sections.push(incompleteSection);
    if (completeSection.rowCount !== 0)
      sections.push(completeSection);

    return sections;
  };
  var showMessageIfTableIsEmpty = function() {
    var responses = survey.responsesForCurrentUser();
    if (_(responses).isEmpty()) {
      contentView.add(label);
      contentView.remove(table);
    } else {
      contentView.remove(label);
      contentView.add(table);
    }
  };

  var self = new TopLevelView('List of Responses');

  self.syncResponses = function() {
    NetworkHelper.pingSurveyWebWithLoggedInCheck( onSuccess = function() {
      var progressBar = progressBarView;
      self.add(progressBar);
      progressBar.init('response.sync.' + survey.id + '.completed', survey.responseCount());
      progressBar.setMessage('Syncing responses...');
      survey.syncResponses(new SyncHandler(progressBar.incrementValue, function(data) { showSyncSummary(data); self.refresh(); }));
    });
  };

  var showSyncSummary = function(data) {
    Ti.API.info("showing sync summary: " + data);
    if (data.message)
      alert(data.message);
    else
      alert("successes: " + (data.successes || 0) + "\nerrors: " + (data.errors || 0));
  };

  var contentView = Ti.UI.createView({
    top : Measurements.HEADER_HEIGHT,
    layout :'vertical',
    height : Ti.UI.SIZE
  });

  var surveyDetailsView = new SurveyDetailsView(survey);
  contentView.add(surveyDetailsView);

  surveyDetailsView.addEventListener('SurveyDetailsView.sync_responses',  self.syncResponses);

  contentView.add(new SeparatorView(Palette.PRIMARY_COLOR, Measurements.PADDING_XX_SMALL));

  self.add(contentView);

  var table = Titanium.UI.createTableView({
    separatorColor : 'transparent',
    data : convertModelDataForTable()
  });

  table.addEventListener('click', function(e) {
    self.fireEvent('ResponsesIndexView:table_row_clicked', {
      responseID : e.row.responseID
    });
  });

  var label = Ti.UI.createLabel({
    color : '#333',
    font : {
      fontSize : Measurements.FONT_BIG    },
    text : 'No responses.',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    top : '40%',
    width : 'auto',
    height : 'auto'
  });

  self.refresh = function(e) {
    surveyDetailsView.refresh();
    table.setData(convertModelDataForTable());
    showMessageIfTableIsEmpty();
  };

  Ti.App.addEventListener('ResponseShowWindow:closed', self.refresh);

  Ti.App.addEventListener('ResponseShowWindow:back', self.refresh);

  Ti.App.addEventListener('ResponseNewWindow:closed', self.refresh);

  showMessageIfTableIsEmpty();
  return self;
}

module.exports = ResponsesIndexView;
