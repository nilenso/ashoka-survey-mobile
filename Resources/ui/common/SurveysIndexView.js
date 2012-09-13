//SurveysIndexView Component Constructor
function SurveysIndexView() {
	var Survey = require('models/survey');
	var survey = new Survey();
	Ti.App.addEventListener('surveys.fetch.success', function(){
		survey.list();
	});
	
	//create object instance, a parasitic subclass of Observable
	var self = Ti.UI.createView();

	//label using localization-ready strings from <app dir>/i18n/en/strings.xml
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : 'No surveys have been added yet. Sorry about that!',
		height : 'auto',
		width : 'auto'
	});
	self.add(label);
	label.addEventListener('click', function() {
		survey.fetch();
	});

	return self;
}

module.exports = SurveysIndexView;
