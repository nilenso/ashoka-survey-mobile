var Survey = function() {
	this.surveys = [];
	
}

Survey.prototype = {
	fetch : function() {
		var url = Ti.App.Properties.getString('server_url') + '/api/mobile/surveys';
		var that = this;
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				Ti.API.info("Received text: " + this.responseText);
				that.surveys = JSON.parse(this.responseText);
				Ti.App.fireEvent('surveys.fetch.success');
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				Ti.App.fireEvent('surveys.fetch.error');
			},
			timeout : 5000 // in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();
	},

	list : function() {
		return this.surveys;
	}
};


module.exports = Survey;

