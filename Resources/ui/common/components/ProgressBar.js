var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');
var ProgressBarView = function() {

  var self = Ti.UI.createView({
    layout : 'vertical',
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    width : '100%',
    height : '100%',
    zIndex : 99999999,
    top : Measurements.HEADER_HEIGHT
  });

  var titleLabel = Ti.UI.createLabel({
    color : Palette.PRIMARY_COLOR,
    font : {
      fontSize : Measurements.FONT_MEDIUM    },
    text : 'Fetching your surveys',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    top : '30%',
    width : 'auto'
  });

  var progressBar = Titanium.UI.createProgressBar({
    width : '90%',
    height : 'auto',
    min : 0,
    value : 0,
    keepScreenOn : true,
    hidden : true
  });

  var hideProgressBarIfComplete = function() {
    if (!progressBar.hidden && progressBar.getMax() == progressBar.getValue()) {
      Ti.API.info("Hide Progress Bar called with max = " + progressBar.getMax() + " and value = " + progressBar.getValue());
      self.reset();
      self.hide();
      self.fireEvent(self.actionName);
    }
  };

  self.hideView = function() {
    self.reset();
    self.hide();
  };

  self.isHidden = function() {
    return progressBar.hidden;
  };

  self.reset = function() {
    progressBar.hidden = true;
    progressBar.setValue(0);
    Ti.API.info("Progress bar value after reset is " + progressBar.getValue());
    progressBar.setMax(undefined);
  };

  self.setMessage = function(message) {
    if(!progressBar.hidden) {
      self.show();
      titleLabel.setText(message);
      hideProgressBarIfComplete();
    }
  };

  self.init = function(actionName, max) {
    progressBar.hidden = false;
    self.actionName = actionName;
    if(max)
      progressBar.setMax(max);
    self.show();
  };

  self.updateValue = function(value) {
    if(!progressBar.hidden) {
      progressBar.setValue(progressBar.getValue() + value);
      Ti.API.info("Progress bar value is now: " + progressBar.getValue());
      hideProgressBarIfComplete();
    }
  };

  self.incrementValue = function() {
    if(!progressBar.hidden)
      self.updateValue(1);
  };

  self.add(titleLabel);
  self.add(progressBar);
  return self;
};

module.exports = new ProgressBarView();
