function ResponseEditWindow(responseID) {
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
	var ResponseEditView = require('ui/common/responses/ResponseEditView');

	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : "#fff"
	});
	var view = new ResponseEditView(responseID);
	self.add(view);
	
	view.addEventListener('ResponsesEditView:savedResponse', function() {
		Ti.App.fireEvent('ResponseEditWindow:closed');
    	view.cleanup();
    	view = null;		
		self.close();
	});

	self.addEventListener('android:back', function() {
    	view.cleanup();
    	view = null;
    	self.close();
	});
	
	return self;
}

module.exports = ResponseEditWindow;