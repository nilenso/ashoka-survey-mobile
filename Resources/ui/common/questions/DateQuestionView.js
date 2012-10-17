//DateQuestionView Component Constructor
function DateQuestionView(question) {

	self = Ti.UI.createPicker({
		type : Ti.UI.PICKER_TYPE_DATE,
		value : new Date(),
		color : '#336699',
		right : 5,
		left : 5,
	});
	self.addEventListener('change', function(e) {
		this.value = e.value;
	});
	self.getValue = function() {
		var val = this.value.toISOString();
		return val.substr(0, val.indexOf('T')).replace(/-/g, '/');
		;
	};

	return self;
}

module.exports = DateQuestionView;
