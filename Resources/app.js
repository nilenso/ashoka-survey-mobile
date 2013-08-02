// Setup database
Ti.App.joli = require('lib/joli').connect('FreshestDB', '/db/main.sqlite');


/*
 * Backup the SQLite Database
 * --------------------------
 * - Backs up to the SD Card
 * - If an SD card isn't present, it backs up to /com.c42.surveyMobile/newDatabase.sqlite
 * - Use Android File Transfer to pull it out
 *
 */
//var f = Ti.Filesystem.getFile('file:///data/data/com.c42.surveyMobile/databases/FreshestDB');
//var tempFile = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, "newDatabase.sqlite");
//tempFile.write(f.read());


//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var Window;

	// Android uses platform-specific properties to create windows.
	// All other platforms follow a similar UI pattern.
	if (osname === 'android') {
		Window = require('ui/handheld/android/SurveysIndexWindow');
		new Window().open();
	} else {
		Window = Ti.UI.createWindow();
		navGroup = Ti.UI.iPhone.createNavigationGroup({
			window: require('ui/handheld/iphone/SurveysIndexWindow')()
		});
		Window.add(navGroup);
		Window.open();
	}
	if (Ti.App.Properties.getString('server_url') === null) {
		Ti.App.Properties.setString('server_url', 'http://thesurveys.org');
	}

	//Move to HTTPS
	var server_url = Ti.App.Properties.getString('server_url');
	if(server_url.match("http:\/\/")) {
	  server_url = server_url.replace(/^(http)(:\/\/)/, "https$2")
	  Ti.App.Properties.setString('server_url', server_url);
	}

	Ti.include('/test/tests.js');
})();
