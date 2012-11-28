var ConfirmDialog = function(title, message, onConfirm) {

  var self = Ti.UI.createAlertDialog({
    title : title,
    cancel : 1,
    buttonNames : ['Confirm', 'Cancel'],
    message : message
  });

  self.addEventListener('click', function(e) {
    if (e.index === e.source.cancel) {
      Ti.API.info('The action was cancelled');
    } else {
      onConfirm.call();
    }
  });

  return self;
};

module.exports = ConfirmDialog;
