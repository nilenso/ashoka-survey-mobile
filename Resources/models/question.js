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
				Ti.API.info("IMAGE URL IS: " + this.image_url.toString());
			}
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Question;

