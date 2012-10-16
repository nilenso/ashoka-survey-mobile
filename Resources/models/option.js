var Option = new Ti.App.joli.model({
	table : 'Option',
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
			_(data).each(function(Option) {
				var record = that.newRecord({
					id : Option.id,
					content : Option.content,
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

