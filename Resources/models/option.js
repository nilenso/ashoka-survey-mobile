var _ = require('lib/underscore')._;

var Option = new Ti.App.joli.model({
	table : 'options',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		question_id : 'INTEGER',
		order_number : 'INTEGER'
	},

	methods : {
		createRecords : function(data, questionID, externalSyncHandler) {
			var _ = require('lib/underscore')._;
			var that = this;
			var records = [];
			_(data).each(function(option) {
				var record = that.newRecord({
					id : option.id,
					content : option.content,
					question_id : questionID,
					order_number : option.order_number
				});
				record.save();
				var Question = require('models/question');
				var surveyID = Question.findById(questionID).survey_id;
				if (!_.isEmpty(option.questions)) {
					Question.createRecords(option.questions, surveyID, record.id, externalSyncHandler, null);
				}
				var Category = require('models/category');
				Category.createRecords(option.categories, surveyID, record.id, externalSyncHandler, null);
				records.push(record);
			});
			return records;
		}
	},

	objectMethods : {
		firstLevelSubQuestions : function() {
            var query = new Ti.App.joli.query().select('*').from('questions');
            query.where('parent_id = ?', this.id);
            query.order('order_number');
            return query.execute();
		},

		firstLevelSubCategories : function() {
            var query = new Ti.App.joli.query().select('*').from('categories');
            query.where('parent_id = ?', this.id);
            query.order('order_number');
            return query.execute();
		},

		firstLevelSubElements : function() {
			var elements = this.firstLevelSubQuestions().concat(this.firstLevelSubCategories());
      var sortedElements = _(elements).sortBy(function(element){ return element.order_number; });
      return sortedElements;
		},

		subQuestions : function() {
			var Question = require('models/question');
			var Category  = require('models/category');
			var questions = Question.findBy('parent_id', this.id);
			var categories = Category.findBy('parent_id', this.id);
			var elements = questions.concat(categories);
			var sortedElements = _(elements).sortBy(function(question){ return question.order_number; });

			var subElements = _.chain(sortedElements).map(function(element) {
				return element.withSubQuestions();
			}).flatten().value();
			return subElements;
		},

		hasSubElements : function() {
			return !_(this.firstLevelSubElements()).isEmpty();
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Option;

