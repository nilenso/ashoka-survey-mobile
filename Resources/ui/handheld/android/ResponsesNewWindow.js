function ResponsesNewWindow(surveyID) {
  var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
  var ResponsesNewView = require('ui/common/responses/ResponsesNewView');
  var ConfirmDialog = require('ui/common/components/ConfirmDialog');

  var self = Ti.UI.createWindow({
    navBarHidden : true,
    backgroundColor : "#fff"
  });
  var view = new ResponsesNewView(surveyID);
  self.add(view);

  view.addEventListener('ResponsesNewView:savedResponse', function() {
    Ti.App.fireEvent('ResponseNewWindow:closed');
    self.close();
  });

  var confirmDialog = new ConfirmDialog("Confirmation", "This will clear the answers,\n Are you sure?", onConfirm = function(e) {
    self.close();
  });

  self.addEventListener('android:back', function() {
    confirmDialog.show();
  });

  return self;
}

module.exports = ResponsesNewWindow;
