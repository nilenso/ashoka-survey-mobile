var callback;
function locationHandler(e) {
  if (e.success === undefined || e.success) {
    if (typeof (callback) === 'function') {
      callback(e.coords);
    }
  }
} 
function start(obj) {
  callback = obj.action;
  Ti.Geolocation.addEventListener("location", locationHandler);
}
function stop() {
  callback = undefined;
  Ti.Geolocation.removeEventListener("location", locationHandler);
}
exports.start = start;
exports.stop = stop;
