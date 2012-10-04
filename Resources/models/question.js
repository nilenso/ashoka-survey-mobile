var Question = new Ti.App.joli.model({
	table : 'question',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		survey_id : 'INTEGER',
		mandatory : 'INTEGER',
		max_length : 'INTEGER',
		image_url : 'TEXT'
	},

	methods : {
		createRecords : function(data, surveyID) {
			var _ = require('lib/underscore')._;
			var that = this;
			var records = [];
			_(data).each(function(question) {
				var record = that.newRecord({
					id : question.id,
					content : question.content,
					survey_id : surveyID,
					max_length : question.max_length,
					mandatory : question.mandatory,
					image_url : question.image_url
				});
				record.save();
				records.push(record);
			});
			return records;
		},
	},

	objectMethods : {
		fetchImage : function() {
			if (this.image_url) {
				var self = this;
				var url = Ti.App.Properties.getString('server_url') + self.image_url;
				var client = Ti.Network.createHTTPClient({
					// function called when the response data is available
					onload : function(e) {
						Ti.API.info("Downloaded image from " + self.image_url);
						var data = this.responseData;
						var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, self.id.toString());
						f.write(data);
					},
					// function called when an error occurs, including a timeout
					onerror : function(e) {
						Ti.API.info("Error downloading image from " + self.image_url);
					},
					timeout : 5000 // in milliseconds
				});
				// Prepare the connection.
				client.open("GET", url);
				// Send the request.
				client.send();
			}
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Question;

