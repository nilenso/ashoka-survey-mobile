function ResponseShowWindow(responseID) {
	var ResponseShowView = require('ui/common/responses/ResponseShowView')
	var ResponseEditWindow = require('ui/handheld/iphone/ResponseEditWindow')

	var self = Ti.UI.createWindow({
		title : 'All Responses',
		backgroundColor : "#fff"
	});
	
	var view = new ResponseShowView(responseID);
	self.add(view);
	
	view.addEventListener('ResponseShowView:responseEdit', function(e){
		navGroup.open(new ResponseEditWindow(e.responseID));	
	})


	return self;
}

module.exports = ResponseShowWindow;
