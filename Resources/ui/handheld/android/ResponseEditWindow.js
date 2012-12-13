function ResponseEditWindow(responseID) {
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
	var ResponseEditView = require('ui/common/responses/ResponseEditView');

	var self = Ti.UI.createWindow({
		navBarHidden : true,
		backgroundColor : "#fff"
	});
	view = new ResponseEditView(responseID);
	self.add(view);
	
	view.addEventListener('ResponsesEditView:savedResponse', function() {
		self.close();
	});
	
	return self;
}

module.exports = ResponseEditWindow;