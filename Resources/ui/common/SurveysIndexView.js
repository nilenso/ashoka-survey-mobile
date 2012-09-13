//SurveysIndexView Component Constructor
function SurveysIndexView(model) {
	Ti.App.addEventListener('surveys.fetch.success', function(e) {
		var _ = require('lib/underscore')._;
		var data = _(model.list()).map(function(name){
			return { title: name }
		});
		table.setData(data);
	});

	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	// now assign that array to the table's data property to add those objects as rows
	var table = Titanium.UI.createTableView({
	
	});

	self.add(table);

	return self;
}

module.exports = SurveysIndexView;
