var callback;
var timeout;
function locationHandler(e) {
  if (e.success === undefined || e.success) {
    if (typeof (callback) === 'function') {
      clearTimeout(timeout);
      callback(e.coords);
    }
  }
} 
function start(obj) {
  callback = obj.action;
  error = obj.error || function(){} ;
  timeout = setTimeout(function() { 
    stop();
    error(); }, 15000); 
    Ti.Geolocation.addEventListener("location", locationHandler);
  }
  function stop() {
    callback = undefined;
    Ti.Geolocation.removeEventListener("location", locationHandler);
  }
  exports.start = start;
  exports.stop = stop;
