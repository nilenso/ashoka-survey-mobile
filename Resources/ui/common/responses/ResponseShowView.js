//A single survey
function ResponseShowView(responseID) {
  var _ = require('lib/underscore')._;
  var Survey = require('models/survey');
  var Answer = require('models/answer');
  var Question = require('models/question');
  var Response = require('models/response');
  var convertResponseDataForTable = function() {
    var answers = Answer.findBy('response_id', responseID);
    var responses = _(answers).map(function(answer) {
      return {
        'header' : Question.findOneById(answer.question_id).content,
        'title' : answer.content || ''
      }
    });
    return responses;
  }
  var self = Ti.UI.createView({
    layout : 'vertical'
  });

  // now assign that array to the table's data property to add those objects as rows
  var table = Titanium.UI.createTableView({
    data : convertResponseDataForTable()
  });

  var responseEditButton = Ti.UI.createButton({
    title : 'Edit this Response',
    width : '100%'
  });

  responseEditButton.addEventListener('click', function(e) {
    self.fireEvent('ResponseShowView:responseEdit', {
      responseID : responseID
    });
  });
  
  var responseDeleteButton = Ti.UI.createButton({
    title : 'Delete this Response',
    width : '100%'
  });

  responseDeleteButton.addEventListener('click', function(e) {
  	var response = Response.findOneById(responseID);
  	_(response.answers()).each(function(answer){
  		answer.destroy_choices();
  	});
  	response.destroy_answers();
  	response.destroy();
    self.fireEvent('ResponseShowView:responseDeleted', {
      responseID : responseID
    });
  });
  
  var buttonsView = Ti.UI.createView({
    layout : 'vertical'
  });
  buttonsView.add(responseEditButton);
  buttonsView.add(responseDeleteButton);

  table.setFooterView(buttonsView);

  var refreshView = function() {
    table.setData(convertResponseDataForTable());
  };

  Ti.App.addEventListener('updatedResponse', refreshView);

  self.add(table);
  return self;
}

module.exports = ResponseShowView;
