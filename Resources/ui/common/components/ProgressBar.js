var ProgressBarView = function() {

  var self = Ti.UI.createView({
    layout : 'vertical',
    backgroundColor : 'black',
    // opacity : 0.4,
    width : '100%',
    height : '100%'
  });

  var titleLabel = Ti.UI.createLabel({
    color : '#fff',
    font : {
      fontSize : 18
    },
    text : 'Fetching your surveys',
    textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
    top : '30%',
    width : 'auto'
  });

  var progressBar = Titanium.UI.createProgressBar({
    width : '100%',
    height : 'auto',
    min : 0,
    value : 0,
    keepScreenOn : true,
    color : '#fff',
    font : {
      fontSize : 14,
      fontWeight : 'bold'
    }
  });
  var hideProgressBarIfComplete = function() {
    if (progressBar.getMax() == progressBar.getValue()) {
      progressBar.setValue(0);
      self.hide();
      self.fireEvent('sync:complete');
    }
  }

  self.reset = function() {
    progressBar.setValue(0);
  };

  self.setMessage = function(message) {
    titleLabel.setText(message);
    hideProgressBarIfComplete();
  };

  self.setMax = function(max) {
    progressBar.max = max;
    hideProgressBarIfComplete();
  };

  self.updateMax = function(max) {
    progressBar.max = progressBar.getMax() + max;
    Ti.API.info("Progress bar MAX is now: " + progressBar.getMax());
    hideProgressBarIfComplete();
  };

  self.updateValue = function(value) {
    progressBar.setValue(progressBar.getValue() + value);
    Ti.API.info("Progress bar value is now: " + progressBar.getValue());
    hideProgressBarIfComplete();
  };

  self.add(titleLabel);
  self.add(progressBar);
  return self;
}

module.exports = new ProgressBarView();
