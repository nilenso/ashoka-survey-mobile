var _ = require('lib/underscore')._;

var Utility = {
  iterator : function(view) {
    return _([view, view.getSubQuestions()]).compact();
  },

  flatMap : function(obj, context) {
     var composeMap = _.compose(_.flatten, _.map);
     return context ? composeMap(obj, context) : composeMap(obj, iterator);
  }
};

