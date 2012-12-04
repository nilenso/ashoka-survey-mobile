var Toast = function(message) {

  var self = Titanium.UI.createNotification({
    duration : Ti.UI.NOTIFICATION_DURATION_SHORT,
    message : message
  });
  
  return self;
};

module.exports = Toast;
