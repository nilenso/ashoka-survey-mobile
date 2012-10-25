var Option = new Ti.App.joli.model({
	table : 'options',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		question_id : 'INTEGER',
	},

	methods : {
		createRecords : function(data, questionID) {
			var _ = require('lib/underscore')._;
			var that = this;
			var records = [];
			_(data).each(function(option) {
				var record = that.newRecord({
					id : option.id,
					content : option.content,
					question_id : questionID,
				});
				record.save();
				records.push(record);
			});
			return records;
		},
	}
});

Ti.App.joli.models.initialize();
module.exports = Option;
