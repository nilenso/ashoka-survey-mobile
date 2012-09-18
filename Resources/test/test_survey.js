(function() {

	describe('survey model', function() {
		var model;

		beforeEach(function() {
			model = require('models/survey');
			model.truncate();
		});

		afterEach(function() {
			model.truncate();
		});

		it('checks if the model is empty', function() {
			expect(model.isEmpty()).toBeTruthy();
			model.newRecord().save();
			expect(model.isEmpty()).toBeFalsy();
		});

		describe('creating records from a JSON array', function() {
			var data;

			beforeEach(function() {
				data = [{
					id : '1',
					name : 'john',
					description : 'abc',
					expiry_date : "2012-08-09"
				}, {
					id : '2',
					name : 'jack',
					description : 'abcd',
					expiry_date : "2012-03-09"
				}];
			});

			it("creates a new record for each item in the JSON array", function() {
				model.createRecords(data);
				expect(model.count()).toEqual(2);
			});

			it("stores the id, name, description and expiry date", function() {
				model.createRecords(data);
				var record = model.findOneById('id', 1);
				expect(record.get('id')).toEqual(1);
				expect(record.get('name')).toEqual('john');
				expect(record.get('description')).toEqual('abc');
				expect(record.get('expiry_date')).toEqual('2012-08-09');
			});
		});
	});
})();
