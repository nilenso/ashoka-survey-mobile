//OptionView Component Constructor
function OptionView(option) {
	var self = Ti.UI.createTableViewRow();

	if (Ti.Platform.osname == 'android') {
		var checkbox = androidCheckbox();
	} else {
		var checkbox = iPhoneCheckbox();
	}

	self.add(checkbox);

	var size = Ti.Platform.displayCaps.platformHeight * 0.05
	var label = Ti.UI.createLabel({
		color : '#000000',
		text : option.content,
		height : 'auto',
		width : 'auto',
		left : size * 2
	});

	self.add(label);

	return self;

	function iPhoneCheckbox() {
		var checkbox = Ti.UI.createButton({
			title : '',
			height: 30,
			width: 30,
			left : 2,
			color : '#000',
			font : { fontWeight: 'bold' },
			value : false //value is a custom property in this casehere.
		});

		//Attach some simple on/off actions
		checkbox.on = function() {
			Ti.API.info(this.value);
			this.setTitle('✓');
			this.value = true;
		};

		checkbox.off = function() {
			Ti.API.info(this.value);
			this.setTitle('');
			this.value = false;
		};

		checkbox.addEventListener('click', function(e) {
			if (false == e.source.value) {
				e.source.on();
			} else {
				e.source.off();
			}
		});

		return checkbox;
	}

	function androidCheckbox() {
		var basicSwitch = Ti.UI.createSwitch({
			value : false,
			style: Ti.UI.Android.SWITCH_STYLE_CHECKBOX,
			height: size,
			width: size,
			left : 2,
			titleOn : "",
			titleOff : ""
		});

		return basicSwitch;
	}

}

module.exports = OptionView;
