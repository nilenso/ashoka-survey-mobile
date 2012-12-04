//ResponsesIndexView Component Constructor
function ResponsesIndexView(surveyID) {
  var _ = require('lib/underscore')._;
  var Response = require('models/response');
  var Survey = require('models/survey');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var progressBarView = require('ui/common/components/ProgressBar');
  var Palette = require('ui/common/components/Palette');
  var SeparatorView = require('ui/common/components/SeparatorView');

  var convertModelDataForTable = function() {
    var survey = Survey.findOneById(surveyID);
    var responses = survey.responsesForCurrentUser();
    return _(responses).map(function(response) {
      var row = Ti.UI.createTableViewRow({
        hasDetail : true,
        height : Titanium.UI.SIZE,
        layout : 'vertical',
        responseID : response.id
      });

      var responseLabel = Ti.UI.createLabel({
        text : "Response #" + response.id.toString(),
        color : Palette.PRIMARY_COLOR,
        font : {
          fontSize : '20dip'
        }
      });
      
      row.add(responseLabel);

      var answersData = _(response.identifierAnswers()).each(function(answer) {
        var view = Ti.UI.createView({
          layout : 'horizontal',
          left : '10dip'
        });
        var label = Ti.UI.createLabel({
          text : answer.question().content + ": " + answer.contentForDisplay(),
          color : Palette.PRIMARY_COLOR,
          font : {
            fontSize : '15dip'
          }
        });
        view.add(label);
        if (answer.isImage()) {
          var imageView = Ti.UI.createImageView({
            width : 100,
            height : 100,
            image : answer.image
          });
          view.add(imageView);
        }
        row.add(view);
      });

      row.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, '5dip'));
      row.add(new SeparatorView(Palette.WHITE, '5dip'));
      return (row);
    });
  };
  var showMessageIfModelIsEmpty = function() {
    var survey = Survey.findOneById(surveyID);
    var responses = survey.responsesForCurrentUser();
    if (_(responses).isEmpty()) {
      self.add(label);
      self.remove(table);
    } else {
      self.remove(label);
      self.add(table);
    }
  };

  var progressComplete = function(e) {
    Ti.API.info("Sync complete for resopnses!!!");
    data = convertModelDataForTable();
    table.setData(data);
    showMessageIfModelIsEmpty();
    progressBarView.removeEventListener('sync:complete', progressComplete); 
  };
  
  progressBarView.addEventListener('sync:complete', progressComplete); 

  var self = new TopLevelView('List of Responses');

  var showProgressBar = function(e) {
    progressBarView.reset();
    self.add(progressBarView);
    progressBarView.show();
    // Ti.App.removeEventListener('responses.sync.start', showProgressBar);
  };

  Ti.App.addEventListener('responses.sync.start', showProgressBar);

  var table = Titanium.UI.createTableView({
    separatorColor : 'transparent',
    top : self.headerHeight,
    data : convertModelDataForTable()
  });

  table.addEventListener('click', function(e) {
    self.fireEvent('ResponsesIndexView:table_row_clicked', {
      responseID : e.rowData.responseID
    });
  });

  var label = Ti.UI.createLabel({
    color : '#333',
    font : {
      fontSize : '20dip'
    },
    text : 'No responses.',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    top : '40%',
    width : 'auto',
    height : 'auto'
  });

  Ti.App.addEventListener('ResponseShowWindow:closed', function() {
    table.setData(convertModelDataForTable());
    showMessageIfModelIsEmpty();
  });

  showMessageIfModelIsEmpty();
  return self;
};

module.exports = ResponsesIndexView;
