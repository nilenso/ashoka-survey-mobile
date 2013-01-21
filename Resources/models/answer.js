var _ = require('lib/underscore')._;
var Choice = require('models/choice');
var Question = require('models/question');
var Option = require('models/option');
var progressBarView = require('ui/common/components/ProgressBar');

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
      answerData.response_id = responseID;
      var question = Question.findOneById(answerData['question_id']);
      var optionIds = [];

      if (question.isMultiChoiceQuestion()) {
        optionIds = answerData['content'];
        answerData['content'] = "";
      } else if (question.isPhotoQuestion()) {
        var image = answerData['content'];
        answerData['content'] = "";
        answerData['image'] = image;
      }
      answerData['updated_at'] = parseInt(new Date().getTime()/1000, 10);
      var answer = this.newRecord(answerData);
      answer.save();

      _(optionIds).each(function(option_id) {
        Choice.createRecord(answer.id, option_id);
      });
    },

    validate : function(answerData, status) {
      var question = Question.findOneById(answerData.question_id);
      var errors = {};
      if (answerData.content) {
        if (question.max_length && (answerData.content.length >= question.max_length))
          errors['max_length'] = "You have exceeded the maximum length for this question";
        if (question.min_value && answerData.content < question.min_value)
          errors['min_value'] = "The answer is not in the required range";
        if (question.max_value && answerData.content > question.max_value)
          errors['max_value'] = "The answer is not in the required range";
        if (question.type === 'NumericQuestion' && isNaN(answerData.content))
          errors['content'] = "You have to enter only a number";
      } else if (status === "complete" && question.mandatory)
        errors['mandatory'] = "This question is mandatory";
      return errors;
    }
  },
  objectMethods : {

    update : function(content) {
      Ti.API.info("CONTENT IS ");
      Ti.API.info(content);
      Ti.API.info("updating answer");

      var question = this.question();
      var updated_at;
      if (question.isMultiChoiceQuestion()) {
        var optionIds = content;

        var existing_optionIDs = _(Choice.findBy('answer_id', this.id)).map(function(choice) {
          return choice.option_id;
        });
        updated_at = optionIds.sort() === existing_optionIDs.sort() ? this.updated_at : parseInt(new Date().getTime()/1000, 10);

        this.destroyChoices();
        var that = this;
        _(optionIds).each(function(option_id) {
          Choice.createRecord(that.id, option_id);
        });

        this.set('content', '');
        this.set('updated_at', updated_at);
      } else if (question.isPhotoQuestion()) {
        var image = content;
        updated_at = image === this.image ? this.updated_at : parseInt(new Date().getTime()/1000, 10);
        this.set('content', '');
        this.set('image', image);
        this.set('updated_at', updated_at);
      } else {
        updated_at = content === this.content ? this.updated_at : parseInt(new Date().getTime()/1000, 10);
        this.set('content', content);
        this.set('updated_at', updated_at);
      }

      this.save();
      Ti.API.info("answer saved with content" + this.content);
    },

    hasChoices : function() {
      return Question.findOneById(this.question_id).isMultiChoiceQuestion();
    },

    isImage : function() {
      return Question.findOneById(this.question_id).isPhotoQuestion();
    },

    optionIDs : function() {
      return _(Choice.findBy('answer_id', this.id)).map(function(choice) {
        return choice.option_id;
      });
    },

    question : function() {
      return Question.findOneById(this.question_id);
    },

    contentForDisplay : function() {
      if (this.isImage()) {
        return '';
      } else if (this.hasChoices()) {
        return _(this.optionIDs()).map(function(optionId) {
          return Option.findOneById(optionId).content;
        }).join(', ');
      } else {
        return this.content;
      }
    },

    destroyChoices : function() {
      return _(Choice.findBy('answer_id', this.id)).each(function(choice) {
        choice.destroy();
      });
    },

    destroyImage : function () {
      if (this.isImage() && this.image)
        Ti.Filesystem.getFile(this.image).deleteFile();
    },

    destroyAll : function() {
      this.destroyChoices();
      this.destroyImage();
      this.destroy();
    }
  }
});

Ti.App.joli.models.initialize();
module.exports = Answer;

