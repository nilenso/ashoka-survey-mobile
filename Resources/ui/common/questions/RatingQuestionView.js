//RatingQuestionView Component Constructor
var _ = require('lib/underscore')._;
function RatingQuestionView(question, content) {

  var self = Ti.UI.createView({
    layout : 'horizontal',
    height : 30
  });

  var rating;
  var stars = [];

  var setRating = function(newRating) {
    rating = newRating;
    for (var i = 0, l = stars.length; i < l; i++) {
      if (i >= rating) {
        stars[i].image = '/images/star_off.png';
      } else {
        stars[i].image = '/images/star.png';
      }
    }
  }
  var noOfStars = question.max_length ? question.max_length : 5;
  for (var i = 0; i < noOfStars; i++) {
    var star = Ti.UI.createImageView({
      height : 24,
      width : 24,
      image : '/images/star_off.png'
    });

    (function() {
      var index = i;
      star.addEventListener('click', function() {
        setRating(index + 1);
      });
    })();

    stars.push(star);
    Ti.API.info("Created star with image:" + stars[i]);
    self.add(star);
  }

  Ti.API.info("Created stars:" + stars);

  Ti.API.info("Content is:" + content);
  if (content)
    setRating(content);

  self.getValue = function() {
    return rating;
  };

  return self;
};

module.exports = RatingQuestionView;
