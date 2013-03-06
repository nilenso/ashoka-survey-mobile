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
      new Ti.App.joli.query()
      .destroy()
      .from('records')
      .where('response_id is NULL')
      .execute();
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
    },

    sync : function() {
      var self = this;

      var url = Ti.App.Properties.getString('server_url') + '/api/records';
      var params = { category_id : this.category_id };

      var client = Ti.Network.createHTTPClient({
        onload : function() {
          Ti.API.info("success!");
          var response = JSON.parse(this.responseText);
          self.set('web_id', response['id']);
          self.save();
          Ti.App.fireEvent('record.sync.' + self.id, {
            has_error : false,
            id : self.id
          });
        },
        onerror : function() {
          Ti.API.info("error!");
          Ti.API.info(this.responseText);
          var recordId = self.id;
          var hasError = deleteRecordOnGone(this.status);
          Ti.App.fireEvent('record.sync.' + recordId, {
            has_error : hasError,
            id : recordId
          });
        }
      });
      var method = self.web_id ? "PUT" : "POST";
      url += self.web_id ? "/" + self.web_id : "";
      url += ".json";
      client.open(method, url);
      client.setRequestHeader("Content-Type", "application/json");
      client.send(JSON.stringify(params));

      var deleteRecordOnGone = function(status) {
        if (status == '410') {// Record deleted on server
          Ti.API.info("Record deleted on server");
          self.destroyWithAnswers();
          return false;
        } else {
          return true;
        }
      };
    },

    answers : function() {
      return Answer.findBy('record_id', this.id);
    },

    destroyWithAnswers : function() {
      _(this.answers()).each(function(answer) {
        answer.destroyAll();
      });
      this.destroy();
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Record;

