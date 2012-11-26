var HeaderView = function() {

  var self = Ti.UI.createView({
    height : Ti.UI.SIZE,
    layout : 'vertical'
  }); 
  
  var appNameContainer = Ti.UI.createView({
    height : Ti.UI.SIZE,
    layout : 'horizontal'
  });

  var logo = Ti.UI.createImageView({
    image : '/images/logo.png',
    height : Ti.UI.SIZE
  });

  var appName = Ti.UI.createLabel({
    color : '#000',
    font : {
      fontSize : '15dip',
      fontWeight : 'bold'
    },
    shadowColor : '#eee',
    shadowOffset : {
      x : '10dip',
      y : '10dip'
    },
    left : '10dip',
    text : 'Ashoka Surveys',
    height : Ti.UI.SIZE
  });
  
  var separatorLine = Ti.UI.createView({
    backgroundColor : '#eee',
    height : '2dip'
  });

  appNameContainer.add(logo);
  appNameContainer.add(appName);
  self.add(appNameContainer);
  self.add(separatorLine);

  return self;
}

module.exports = HeaderView;
