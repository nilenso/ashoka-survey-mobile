(function(){
	
	describe('survey model', function() {

		it('checks if the model is empty', function() {
			model = require('models/survey');
			model.truncate();
			expect(model.isEmpty()).toBeTruthy();
			model.newRecord().save();
			expect(model.isEmpty()).toBeFalsy();
		});	
	});
	
})();