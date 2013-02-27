var _ = require('lib/underscore')._;
var Response = require('models/response');
var ButtonView = require('ui/common/components/ButtonView');

function MultiRecordCategoryView(multiRecordCategory, response, number, pageNumber) {
  var view_height = 400;
  var self = Ti.UI.createView({
    layout : 'vertical',
    height : Titanium.UI.SIZE
  });

  var button = new ButtonView('Add a Record', { 'width' : '80%' });
  self.add(button);

  var QuestionView = require('ui/common/questions/QuestionView');
  var addRecord = function(e, recordID) {
    if(!recordID) {
      var Record = require('models/record');
      var record = Record.createRecord({
        category_id : multiRecordCategory.id
      });
      recordID = record.id;
    }
    var subQuestions = multiRecordCategory.firstLevelSubQuestions();
    _(subQuestions).each(function(subQuestion, index) {
      Ti.API.info("Record id is : " + recordID);
      var subQuestionAnswer = response && recordID ? response.answerForQuestion(subQuestion.id, recordID) : null;
      var subQuestionNumber = number + '.' + (index + 1);
      self.add(new QuestionView(subQuestion, subQuestionAnswer, response, subQuestionNumber, null, pageNumber, recordID));
    });
  };

  var records;
  if(response) {
    records = response.recordsForMultiRecordCategory(multiRecordCategory.id);
    _(records).each(function(record){
      addRecord(null, record.id);
    });
  }

  button.addEventListener('click', addRecord);

  self.getValue = function() {
    return null;
  };

  return self;
}

module.exports = MultiRecordCategoryView;
