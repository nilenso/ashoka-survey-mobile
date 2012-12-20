var SyncHandler = function(notifySyncProgress, notifySyncComplete, notifySyncError) {
  this.notifySyncProgress = notifySyncProgress || function(){};
  this.notifySyncComplete = notifySyncComplete || function(){};
  this.notifySyncError = notifySyncError || function(){};
}

module.exports = SyncHandler;
