var _ = require('lib/underscore')._;
var Choice = require('models/choice');
var Question = require('models/question');

var Answer = new Ti.App.joli.model({
	table : 'answers',
	columns : {
		id : 'INTEGER PRIMARY KEY',
		content : 'TEXT',
		response_id : 'INTEGER',
		question_id : 'INTEGER',
		web_id : 'INTEGER',
		updated_at : 'TEXT',
		image : 'TEXT'
	},

	methods : {
		createRecord : function(answerData, responseID) {
			var _ = require('lib/underscore')._;
			var that = this;
			answerData.response_id = responseID
			var question = Question.findOneById(answerData['question_id']);
			if (question.type == 'MultiChoiceQuestion') {
				var optionIds = answerData['content'];
				answerData['content'] = "";
				answerData['updated_at'] = (new Date()).toString();
				var answer = that.newRecord(answerData);
				answer.save();
				_(optionIds).each(function(option_id) {
					Choice.createRecord(answer.id, option_id);
				});
			} else if (question.type == 'PhotoQuestion') {
				var image = answerData['content'];
				answerData['content'] = "";
				answerData['image'] = image;
				answerData['updated_at'] = (new Date()).toString();
				var answer = that.newRecord(answerData);
				answer.save();
			} else {
				answerData['updated_at'] = (new Date()).toString();
				that.newRecord(answerData).save();
			}
		},

		validate : function(answerData, status) {
			var question = Question.findOneById(answerData.question_id);
			var errors = {};
			if (answerData.content) {
				if (question.max_length && (answerData.content.length >= question.max_length))
					errors['max_length'] = "You have exceeded the maximum length for this question";
				if (question.min_value && answerData.content < question.min_value)
					errors['min_value'] = "You have fallen short of the minimum limit";
				if (question.max_value && answerData.content > question.max_value)
					errors['max_value'] = "You have exceeded the maximum limit";
				if (question.type == 'NumericQuestion' && isNaN(answerData.content))
					errors['content'] = "You have to enter only a number";
			} else if (status == "complete" && question.mandatory)
				errors['mandatory'] = "This question is mandatory";
			return errors;
		}
	},
	objectMethods : {

		update : function(content) {
			Ti.API.info("CONTENT IS ");
			Ti.API.info(content);
			Ti.API.info("updating answer");

			var question = Question.findOneById(this.question_id);
			var updated_at = content == this.content ? this.updated_at : (new Date()).toString();

			if (question.type == 'MultiChoiceQuestion') {
				var optionIds = content;
				var that = this;

				existing_optionIDs = _(Choice.findBy('answer_id', this.id)).map(function(choice) {
					return choice.option_id;
				})

				var updated_at = optionIds.sort() == existing_optionIDs.sort() ? this.updated_at : (new Date()).toString();

				_(Choice.findBy('answer_id', this.id)).each(function(choice) {
					choice.destroy();
				});

				_(optionIds).each(function(option_id) {
					Choice.createRecord(that.id, option_id);
				});

				this.fromArray({
					'id' : this.id,
					'content' : '',
					'response_id' : this.response_id,
					'question_id' : this.question_id,
					'web_id' : this.web_id,
					'updated_at' : updated_at
				});
			} else if (question.type == 'PhotoQuestion') {
				var image = content;
				var that = this;
				var updated_at = image == this.image ? this.updated_at : (new Date()).toString();

				this.fromArray({
					'id' : this.id,
					'content' : '',
					'response_id' : this.response_id,
					'question_id' : this.question_id,
					'web_id' : this.web_id,
					'updated_at' : updated_at,
					'image' : image
				});
			} else {
				this.fromArray({
					'id' : this.id,
					'content' : content,
					'response_id' : this.response_id,
					'question_id' : this.question_id,
					'web_id' : this.web_id,
					'updated_at' : updated_at
				});
			}
			this.save();
			Ti.API.info("answer saved with content" + this.content);
		},

		hasChoices : function() {
			return Question.findOneById(this.question_id).type == 'MultiChoiceQuestion';
		},
		isImage : function() {
			return Question.findOneById(this.question_id).type == 'PhotoQuestion';
		},

		optionIDs : function() {
			return _(Choice.findBy('answer_id', this.id)).map(function(choice) {
				return choice.option_id;
			});
		},

		question : function() {
			return Question.findOneById(this.question_id);

		},

		destroyChoices : function() {
			return _(Choice.findBy('answer_id', this.id)).each(function(choice) {
				choice.destroy();
			});
		},

		uploadImage : function(status) {
			if (this.isImage()) {
				var client = Ti.Network.createHTTPClient();
				var self = this;

				client.onload = function(e) {
					Ti.API.info("Succceesssss fully saved IMAGE!" + e);
					if (status == "complete") {
						var imageFile = Titanium.Filesystem.getFile(self.image);
						imageFile.deleteFile();
					}
				};

				client.onerror = function(e) {
					Ti.API.info("Error saving IMAGE! :( ");
					Ti.API.info(e.error);
				};

				var image = Titanium.Filesystem.getFile(this.image);
				read_image = image.read();

				var url = Ti.App.Properties.getString('server_url') + '/api/responses/' + this.response_id.toString() + '/image_upload';
				client.open('POST', url);
				client.setRequestHeader("enctype", "multipart/form-data;");
				client.send({
					media : read_image,
					answer_id : this.web_id
				});
			}
		}
	}
});

Ti.App.joli.models.initialize();
module.exports = Answer;

