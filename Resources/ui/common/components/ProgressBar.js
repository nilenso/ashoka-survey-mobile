var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');
var ProgressBarView = function() {

  var self = Ti.UI.createView({
    layout : 'vertical',
    backgroundColor : Palette.SECONDARY_COLOR_LIGHT,
    width : '100%',
    height : '100%',
    keepVisible : false,
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
    keepScreenOn : true
  });

  var hideProgressBarIfComplete = function() {
    if (!self.keepVisible && progressBar.getMax() == progressBar.getValue()) {
      self.reset();
      self.hide();
      self.fireEvent(self.actionName);
    }
  };

  self.reset = function() {
    progressBar.setValue(0);
    progressBar.max = undefined;
  };

  self.setMessage = function(message) {
    self.show();
    titleLabel.setText(message);
    hideProgressBarIfComplete();
  };

  self.updateMax = function(max) {
    var currentMax = typeof progressBar.getMax() !== 'undefined' ? progressBar.getMax() : 0;
    progressBar.max = currentMax + max;
    Ti.API.info("Progress bar MAX is now: " + progressBar.getMax());
    hideProgressBarIfComplete();
  };

  self.init = function(actionName) {
    self.actionName = actionName;
    self.show();
  };

  self.updateValue = function(value) {
    progressBar.setValue(progressBar.getValue() + value);
    Ti.API.info("Progress bar value is now: " + progressBar.getValue());
    hideProgressBarIfComplete();
  };

  self.add(titleLabel);
  self.add(progressBar);
  return self;
};

module.exports = new ProgressBarView();
