var _ = require('lib/underscore')._;
var Option = require('models/option');
var Question = new Ti.App.joli.model({
	table : 'questions',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		survey_id : 'INTEGER',
		mandatory : 'INTEGER',
		max_length : 'INTEGER',
		image_url : 'TEXT',
		type : 'TEXT',
		max_value : 'INTEGER',
		min_value : 'INTEGER',
		parent_id : 'INTEGER',
		identifier : 'INTEGER',
		order_number : 'INTEGER' 
	},

	methods : {
		createRecords : function(data, surveyID, parentID) {
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
					image_url : question.image_url,
					type : question.type,
					min_value : question.min_value,
					max_value : question.max_value,
					parent_id : parentID,
					identifier : question.identifier,
					order_number : question.order_number
				});
				record.save();
				records.push(record);
				record.fetchOptions();
			});
			return records;
		}
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
						Ti.App.fireEvent('surveys.question.image.fetch.done');
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
		},
		fetchOptions : function() {
			Ti.App.fireEvent('surveys.questions.options.fetch.start');
			var self = this;
			if (self.type != 'RadioQuestion' && self.type != 'DropDownQuestion' && self.type != 'MultiChoiceQuestion')
				return;
			var url = Ti.App.Properties.getString('server_url') + '/api/options?question_id=' + self.id;
			var numberOfOptionSubQuestions = 0;
			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					Ti.API.info("Received text for options: " + this.responseText);
					var data = JSON.parse(this.responseText);
					var records = Option.createRecords(data, self.id);
					_(records).each(function(record) {
						_(record.subQuestions()).each(function(subQuestion) {
							if (subQuestion.type == 'RadioQuestion' || subQuestion.type == 'DropDownQuestion' || subQuestion.type == 'MultiChoiceQuestion') {
								numberOfOptionSubQuestions++;
							}
						});
					});
					Ti.App.fireEvent('surveys.questions.options.fetch.done', {
						number_of_option_sub_questions : numberOfOptionSubQuestions
					});
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.info("Error");
				},
				timeout : 5000 // in milliseconds
			});
			// Prepare the connection.
			client.open("GET", url);
			// Send the request.
			client.send();
		},

		options : function() {
			return Option.findBy('question_id', this.id);
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Question;

