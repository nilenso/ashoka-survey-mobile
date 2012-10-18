function ResponseShowWindow(responseID) {
	var ResponseShowView = require('ui/common/responses/ResponseShowView')

	var self = Ti.UI.createWindow({
		title : 'Response',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	self.add(new ResponseShowView(responseID));

	return self;
}

module.exports = ResponseShowWindow;
