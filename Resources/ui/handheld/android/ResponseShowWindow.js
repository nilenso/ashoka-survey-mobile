function ResponseShowWindow(responseID) {
	var ResponseShowView = require('ui/common/responses/ResponseShowView')

	self = Ti.UI.createWindow({
		title : 'All Responses',
		navBarHidden : false,
		backgroundColor : "#fff"
	});
	self.add(new ResponseShowView(responseID));

	return self;
}

module.exports = ResponseShowWindow;
