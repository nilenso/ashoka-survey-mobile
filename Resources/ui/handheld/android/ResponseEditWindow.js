function ResponseEditWindow(responseID) {
  // try {
	var ResponseEditView = require('ui/common/responses/ResponseEditView');
	var ConfirmDialog = require('ui/common/components/ConfirmDialog');

	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : "#fff"
	});
	var view = new ResponseEditView(responseID);
	self.add(view);

	view.addEventListener('ResponsesEditView:savedResponse', function() {
		Ti.App.fireEvent('ResponseEditWindow:closed');
    if(view) { view.cleanup(); }
    view = null;
		self.close();
	});
	
	var confirmDialog = new ConfirmDialog(L("confirm"), L("confirm_clear_unsaved_answers"), onConfirm = function(e) {
      require('models/record').deleteOrphanRecords();
      if (view) {
        view.cleanup();
        view = null;
      }
      self.close();
  });

	self.addEventListener('android:back', function() {
    confirmDialog.show();
	});

	return self;
  // }
  // catch(e) {
  //   var auditor = require('helpers/Auditor');
  //   auditor.writeIntoAuditFile(arguments.callee.name + " - " + e.toString());
  // }
}

module.exports = ResponseEditWindow;
