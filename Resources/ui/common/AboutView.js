//AboutView Component Constructor
var TopLevelView = require('ui/common/components/TopLevelView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var Measurements = require('ui/common/components/Measurements');

function AboutView() {
  var topLevelView = new TopLevelView('About');
  var self = Ti.UI.createView({
    layout : 'vertical',
    top : Measurements.HEADER_HEIGHT
  });

  topLevelView.add(self);

  var headingLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : labelText,
      color : Palette.PRIMARY_COLOR,
      font : {
        fontSize : Measurements.FONT_MEDIUM,
        fontWeight : 'bold'
      },
      top : Measurements.PADDING_X_BIG
    });
  };

  var nameLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : labelText,
      color : Palette.PRIMARY_COLOR,
      font : {
        fontSize : Measurements.FONT_MEDIUM
      },
      top : Measurements.PADDING_SMALL
    });
  };

  var roleLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : '( ' + labelText + ' )',
      color : Palette.GRAY,
      font : {
        fontSize : Measurements.FONT_SMALL
      },
      top : Measurements.PADDING_SMALL
    });
  };

  var thinSeparator = function() {
    return (new SeparatorView(Palette.GRAY_LIGHT, Measurements.PADDING_XX_SMALL, { width : '50%' }));
  };

  self.add(headingLabel('Ashoka'));
  self.add(thinSeparator());
    self.add(nameLabel('Vishnu Swaminathan'));
      self.add(roleLabel('Original Idea'));
    self.add(nameLabel('Team Integrated Technology Initiative'));
      self.add(roleLabel('Strategy and scaling'));

  self.add(headingLabel('C42'));
  self.add(thinSeparator());
    self.add(nameLabel('Aakash'));
    self.add(nameLabel('Srushti'));
    self.add(nameLabel('Nivedita'));
    self.add(nameLabel('Smit'));
    self.add(nameLabel('Srihari'));
    self.add(nameLabel('Timothy'));

  self.add(headingLabel('Individual Contributors'));
  self.add(thinSeparator());
    self.add(nameLabel('Arpan CJ'));
      self.add(roleLabel('User experience and UI development'));
    self.add(nameLabel('Pooja mishra'));
      self.add(roleLabel('Testing support & automation'));

  return topLevelView;
}

module.exports = AboutView;



