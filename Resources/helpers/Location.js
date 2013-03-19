var callback, error;
var timeout;
var location = {};

function firstLocation(e) {
  if (e.success === undefined || e.success) {
    if ( typeof (callback) === 'function') {
      if (timeout) clearTimeout(timeout);
      setLocation(e);
      log();
      callback(location);
      Ti.Geolocation.removeEventListener("location", firstLocation);

      // Might get more accurate readings if we leave a listener open.
      Ti.Geolocation.addEventListener("location", subsequentLocations);
    }
  }
}

function subsequentLocations(e) {
  if ( typeof (callback) === 'function') {
    setLocation(e);
    log();
  }
}

function setLocation(e) {
  if(e.coords) {
    location.latitude = e.coords.latitude;
    location.longitude = e.coords.longitude;
  }
}

function log() {
  Ti.API.info('latitude is: ' + location.latitude);
  Ti.API.info('longitude is: ' + location.longitude);
}


function start(obj) {
  callback = obj.action;
  error = obj.error || function(){};

  timeout = setTimeout(function() {
    error();
    stop();
  }, 25000);

  Ti.Geolocation.Android.manualMode = false;
  Titanium.Geolocation.distanceFilter = 1;
  Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
  Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
  Ti.Geolocation.frequency = 1;

  Ti.Geolocation.addEventListener("location", firstLocation);

}

function stop() {
  callback = undefined;
  error = undefined;
    if (timeout) clearTimeout(timeout);
  timeout = undefined;
  location = {};

  Ti.Geolocation.removeEventListener("location", firstLocation);
  Ti.Geolocation.removeEventListener("location", subsequentLocations);
}

exports.start = start;
exports.stop = stop;
