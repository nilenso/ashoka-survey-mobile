var _ = require('lib/underscore')._;
var Answer = require('models/answer');

var Record = new Ti.App.joli.model({
  table : 'records',
  columns : {
    id : 'INTEGER PRIMARY KEY',
    response_id : 'INTEGER',
    web_id : 'INTEGER'
  },

  methods : {
    createRecord : function(recordData, responseID){
      Ti.API.info("Creating a record");
      var record = this.newRecord({
        response_id : responseID
      });
      record.save();
      Ti.API.info(record.id);
      _(recordData).each(function(answer) {
        Answer.createRecord(answer, responseID, record.id);
      });
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Record;

