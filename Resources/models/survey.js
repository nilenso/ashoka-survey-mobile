var Survey = function() {
	this._ = require('lib/underscore')._;
	this.open_db();
	this.db.execute('CREATE TABLE IF NOT EXISTS surveys(id INTEGER PRIMARY KEY, name TEXT, description TEXT, expiry_date TEXT);');
	this.close_db();
}

Survey.prototype = {
	fetch : function() {
		var url = Ti.App.Properties.getString('server_url') + '/api/mobile/surveys';
		var that = this;
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				Ti.API.info("Received text: " + this.responseText);
				data = JSON.parse(this.responseText);
				// Emptying the table for now (until we get all the survey info from the server)

				that.open_db();
				that.db.execute('DELETE FROM surveys;');
				that._(data).each(function(survey) {
					that.db.execute('INSERT INTO surveys (id,name,description,expiry_date) VALUES (?,?,?,?)', survey.id, survey.name, survey.description, survey.expiry_date);
				});
				that.close_db();

				Ti.App.fireEvent('surveys.fetch.success');
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				Ti.App.fireEvent('surveys.fetch.error', {
					status : this.status
				});
			},
			timeout : 5000 // in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();
	},

	list : function() {
		var surveys = [];
		this.open_db();
		var survey = this.db.execute('SELECT id,name,description,expiry_date FROM surveys');
		while (survey.isValidRow()) {
			surveys.push({
				name : survey.fieldByName('name'),
				description : survey.fieldByName('description'),
				id : survey.fieldByName('id'),
				expiry_date : survey.fieldByName('expiry_date')
			});
			survey.next();
		}
		survey.close();
		this.close_db();
		return surveys;
	},
	
	isEmpty : function() {
		this.open_db();
		var count = this.db.execute('SELECT * FROM surveys;').getRowCount();
		this.close_db();
		return (count == 0);
	},

	open_db : function() {
		this.db = Ti.Database.open('SurveyMobile');
	},

	close_db : function() {
		this.db.close();
	}
};

module.exports = Survey;

