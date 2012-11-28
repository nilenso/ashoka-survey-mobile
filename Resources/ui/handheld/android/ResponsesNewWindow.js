function ResponsesNewWindow(surveyID) {
  var SurveyDetailsView = require('ui/common/surveys/SurveyDetailsView')
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView')
  var ResponsesNewView = require('ui/common/responses/ResponsesNewView')

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });
  view = new ResponsesNewView(surveyID);
  self.add(view);

  view.addEventListener('ResponsesNewView:savedResponse', function() {
    self.close();
  })
  var createConfirmDialog = function() {
    var confirmDialog = Ti.UI.createAlertDialog({
      title : "Confirmation",
      cancel : 1,
      buttonNames : ['Confirm', 'Cancel'],
      message : "This will clear the answers,\n Are you sure?"
    });

    confirmDialog.addEventListener('click', function(e) {
      if (e.index === e.source.cancel) {
        Ti.API.info('The server change was cancelled');
      } else {
        self.close();
      }
    });
    return confirmDialog;
  };

  self.addEventListener('android:back', function() {
    createConfirmDialog().show();
  });

  return self;
}

module.exports = ResponsesNewWindow;
