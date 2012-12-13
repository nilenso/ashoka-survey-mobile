function ResponseEditWindow(responseID) {
	var ResponsesIndexView = require('ui/common/responses/ResponsesIndexView');
	var ResponseEditView = require('ui/common/responses/ResponseEditView');

	var self = Ti.UI.createWindow({
		title : 'Edit Response',
		backgroundColor : "#fff"
	});
	var view = new ResponseEditView(responseID);
	self.add(view);
	view.addEventListener('ResponsesEditView:savedResponse', function() {
		navGroup.close(self);
	});
	return self;
}

module.exports = ResponseEditWindow;