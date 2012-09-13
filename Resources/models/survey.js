var Survey = function() {
	var surveys = [];
	return {
		fetch : function() {
			var url = Ti.App.Properties.getString('server_url') + '/api/mobile/surveys';
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					surveys = JSON.parse(this.responseText);
					Ti.App.fireEvent('surveys.fetch.success');
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.debug(e.error);
					fireEvent('surveys.fetch.error');
				},
				timeout : 5000 // in milliseconds
			});
			// Prepare the connection.
			client.open("GET", url);
			// Send the request.
			client.send();
		},

		list : function() {
			return surveys;
		}
	};
}

module.exports = Survey;

