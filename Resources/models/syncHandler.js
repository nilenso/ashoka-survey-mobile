var SyncHandler = function(notifySyncProgress, notifySyncComplete) {
  this.notifySyncProgress = notifySyncProgress || function(){};
  this.notifySyncComplete = notifySyncComplete || function(){}
}

module.exports = SyncHandler;
