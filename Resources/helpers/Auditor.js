var Auditor = function() {

  var self = this;
  var deviceId = Ti.Platform.getId();
  var auditFileName = "audit-" + deviceId + ".log";
  var auditUrl = Ti.App.Properties.getString('server_url') + '/api/audits';

  self.firstAudit = Ti.App.Properties.getString('firstAudit') === null ? true : false;

  setNotFirstAudit = function(){
    self.firstAudit = false;
    Ti.App.Properties.setString('firstAudit', false);
  };

  var getFile = function() {
    return Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, auditFileName);
  };

  var getPlatformData = function() {
    return {
      version : Ti.Platform.getVersion(),
      processorCount : Ti.Platform.getProcessorCount(),
      name : Ti.Platform.getName(),
      model : Ti.Platform.getModel(),
      manufacturer : Ti.Platform.getManufacturer(),
      macaddress : Ti.Platform.getMacaddress(),
      id : deviceId,
      batteryLevel : Ti.Platform.getBatteryLevel(),
      availableMemory : Ti.Platform.getAvailableMemory(),
      address : Ti.Platform.getAddress()
    };
  };

  var readFile = function() {
    var file = getFile();
    var content = file.read();
    file = null;
    return content.text;
  };

  var truncateAuditFile = function() {
    var file = getFile();
    file.write("");
    file = null;
  };

  var params = function() {
    var params = {
      device_id : deviceId,
      content :  readFile()
    };
    if(self.firstAudit)
      params['platform_data'] = getPlatformData();
    return params;
  };

  self.writeIntoAuditFile = function(text) {
    var file = getFile();
    file.write("\n" + (new Date()).toString(), true);
    file.write(" : " + text, true);
    file = null;
  };

  self.sendAuditFile = function() {
    var client = Ti.Network.createHTTPClient();
    var requestMethod = self.firstAudit ? "POST" : "PUT";
    client.onload = function(){
      truncateAuditFile();
      setNotFirstAudit();
    };
    client.onerror = function(){alert("error");};
    client.open(requestMethod, auditUrl);
    client.send(params());
  };

  return self;
};

module.exports = new Auditor();
