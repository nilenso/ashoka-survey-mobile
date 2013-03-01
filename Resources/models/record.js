var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Record = new Ti.App.joli.model({
  table : 'records',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    response_id : 'INTEGER',
    category_id : 'INTEGER',
    web_id : 'INTEGER'
  },

  methods : {
    createRecord : function(attributes){
      var record = this.newRecord(attributes);
      record.save();
      return record;
    },

    deleteOrphanRecords : function() {
      var orphanRecords = new Ti.App.joli.query()
        .select()
        .from('records')
        .where('response_id is NULL')
        .execute();
      _(orphanRecords).each(function(record) {
        Ti.API.info("Orphan record : " + record.id);
        record.destroy();
      });
    }
  },
  objectMethods : {
    update : function(recordData, responseID) {
      var self = this;
      self.set('response_id', responseID);
      self.save();
      _(recordData).each(function(answerData) {
        var id = answerData.id;
        Answer.updateOrCreateById(id, answerData, self.response_id);
      });
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Record;

