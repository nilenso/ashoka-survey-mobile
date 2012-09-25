//ResponsesIndexView Component Constructor
function ResponsesIndexView(surveyID) {
	var _ = require('lib/underscore')._;
	var Response = require('models/response');
	var responses = Response.findBy('survey_id', surveyID);
	var convertModelDataForTable = function() {
		return _(responses).map(function(response) {
			return {
				title : response.id,
				hasDetail : true
			}
		});
	}
	
	var showMessageIfModelIsEmpty = function() {
		if(_(responses).isEmpty()) {
			self.add(label);
			self.remove(table);
		} else {
			self.remove(label);
			self.add(table);	
		}
	}

	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
		data : convertModelDataForTable()
	});

	label = Ti.UI.createLabel({
		color : '#333',
		font : { fontSize : 18 },
		text : 'No responses yet.',
		textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
		top : '40%',
		width : 'auto',
		height : 'auto'
	});
	
	showMessageIfModelIsEmpty();
	return self;
}

module.exports = ResponsesIndexView;
