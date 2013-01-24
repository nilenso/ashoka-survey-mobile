//AboutView Component Constructor
var TopLevelView = require('ui/common/components/TopLevelView');
var DatabaseHelper = require('helpers/DatabaseHelper');
var LoginHelper = require('helpers/LoginHelper');
var ButtonView = require('ui/common/components/ButtonView');
var SeparatorView = require('ui/common/components/SeparatorView');
var Palette = require('ui/common/components/Palette');
var ConfirmDialog = require('ui/common/components/ConfirmDialog');
var Measurements = require('ui/common/components/Measurements');

function AboutView() {
  var topLevelView = new TopLevelView('About');
  var self = Ti.UI.createView({
    layout : 'vertical',
    top : '120dip'
  });

  topLevelView.add(self);

  var headingLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : labeltext,
      color : Palette.PRIMARY_COLOR,
      font : {
        fontSize : Measurements.FONT_MEDIUM,
        fontWeight : 'bold'
      },
      top : Measurements.PADDING_SMALL
    });
  };
  var nameLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : labeltext,
      color : Palette.PRIMARY_COLOR,
      font : {
        fontSize : Measurements.FONT_MEDIUM,
        fontWeight : 'normal'
      },
      top : Measurements.PADDING_SMALL
    });
  };
  var roleLabel = function(labelText) {
    return Ti.UI.createLabel({
      text : labeltext,
      color : Palette.GRAY,
      font : {
        fontSize : Measurements.FONT_SMALL,
        fontWeight : 'normal'
      },
      top : Measurements.PADDING_SMALL
    });
  };

  self.add(headingLabel('Ashoka'));
    self.add(nameLabel('Vishnu Swaminathan'));
      self.add(roleLabel('Original Idea'));
    self.add(nameLabel('Team Integrated Technology Initiative'));
      self.add(roleLabel('Strategy and scaling'));

  self.add(headingLabel('C42'));
    self.add(nameLabel('Aakash'));
    self.add(nameLabel('Srushti'));
    self.add(nameLabel('Nivedita'));
    self.add(nameLabel('Smit'));
    self.add(nameLabel('Srihari'));
    self.add(nameLabel('Timothy'));

  self.add(headingLabel('Individual Contributors'));
    self.add(nameLabel('Arpan CJ'));
      self.add(roleLabel('User experience and UI development'));
    self.add(nameLabel('Pooja mishra'));
      self.add(roleLabel('Testing support & automation'));

  return topLevelView;
}

module.exports = AboutView;



