function ResponseShowWindow(responseID) {
	var ResponseShowView = require('ui/common/responses/ResponseShowView')

	var self = Ti.UI.createWindow({
		title : 'All Responses',
		backgroundColor : "#fff"
	});
	self.add(new ResponseShowView(responseID));

	return self;
}

module.exports = ResponseShowWindow;
