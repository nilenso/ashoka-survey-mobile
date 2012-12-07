//A single survey

function ResponseShowView(responseID) {
  var _ = require('lib/underscore')._;
  var Survey = require('models/survey');
  var Answer = require('models/answer');
  var Question = require('models/question');
  var Response = require('models/response');
  var TopLevelView = require('ui/common/components/TopLevelView');
  var ButtonView = require('ui/common/components/ButtonView');
  var SeparatorView = require('ui/common/components/SeparatorView');
  var Palette = require('ui/common/components/Palette');
  var Toast = require('ui/common/components/Toast');
  var ConfirmDialog = require('ui/common/components/ConfirmDialog');
  var Measurements = require('ui/common/components/Measurements');

  var convertResponseDataForTable = function() {
    var response = Response.findOneById(responseID);
    var answers = response.answers();
    var responses = _(answers).map(function(answer) {
      var row = Ti.UI.createTableViewRow({
        layout : 'vertical'
      });

      var questionLabel = Ti.UI.createLabel({
        text : Question.findOneById(answer.question_id).content,
        color : Palette.PRIMARY_COLOR,
        font : {
          fontSize : '20dip',
          fontStyle : 'bold',
        },
        left : Measurements.PADDING_SMALL
      });

      var answerLabel = Ti.UI.createLabel({
        text : answer.contentForDisplay() || '',
        color : Palette.PRIMARY_COLOR,
        left : Measurements.PADDING_SMALL,
        font : {
          fontSize : Measurements.FONT_MEDIUM        }
      });

      row.add(questionLabel);
      row.add(answerLabel);

      if (answer.isImage()) {
        var imageView = Ti.UI.createImageView({
          width : 100,
          height : 100,
          image : answer.image
        });
        row.add(imageView);
      }

      row.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
      row.add(new SeparatorView(Palette.WHITE, Measurements.PADDING_SMALL));
      return (row);
    });
    return responses;
  }
  var self = new TopLevelView('Response Details');

  // now assign that array to the table's data property to add those objects as rows
  var table = Titanium.UI.createTableView({
    separatorColor : 'transparent',
    top : self.headerHeight,
    data : convertResponseDataForTable()
  });

  var responseEditButton = new ButtonView('Edit this Response', {
    'width' : '80%'
  });

  responseEditButton.addEventListener('click', function(e) {
    self.fireEvent('ResponseShowView:responseEdit', {
      responseID : responseID
    });
  });

  var responseDeleteButton = new ButtonView('Delete this Response', {
    'width' : '80%'
  });

  responseDeleteButton.addEventListener('click', function(e) {
    var confirmDialog = new ConfirmDialog("Delete", "Are you sure you want to delete the response?", onConfirm = function(e) {
      var response = Response.findOneById(responseID);
      response.destroyAnswers();
      response.destroy();
      (new Toast('Response deleted')).show();
      self.fireEvent('ResponseShowView:responseDeleted', {
        responseID : responseID
      });
    });
    confirmDialog.show();
  });

  var buttonsView = Ti.UI.createView({
    layout : 'vertical'
  });
  buttonsView.add(responseEditButton);
  buttonsView.add(new SeparatorView(Palette.SECONDARY_COLOR_LIGHT, Measurements.PADDING_SMALL));
  buttonsView.add(responseDeleteButton);

  table.setFooterView(buttonsView);

  var refreshView = function() {
    table.setData(convertResponseDataForTable());
  };

  Ti.App.addEventListener('updatedResponse', refreshView);

  self.add(table);
  return self;
};

module.exports = ResponseShowView;
