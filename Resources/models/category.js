var _ = require('lib/underscore')._;
var progressBarView = require('ui/common/components/ProgressBar');

var Category = new Ti.App.joli.model({
  table : 'categories',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    content : 'TEXT',
    survey_id : 'INTEGER',
    parent_id : 'INTEGER',
    order_number : 'INTEGER',
    category_id : 'INTEGER'
  },

  methods : {
    createRecords : function(data, surveyID, parentID, externalSyncHandler) {
      var _ = require('lib/underscore')._;
      var that = this;
      var records = [];
      _(data).each(function(category) {
        var record = that.newRecord({
          id : category.id,
          content : category.content,
          survey_id : surveyID,
          parent_id : parentID,
          category_id : null,
          order_number : category.order_number
        });
        Ti.API.info({
          id : category.id,
          content : category.content,
          survey_id : surveyID,
          parent_id : parentID,
          category_id : null,
          order_number : category.order_number
        });
        record.save();
        records.push(record);
      });
      return records;
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Category;

