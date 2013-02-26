var callback, error;
var timeout;
var location = {};

function firstLocation(e) {
  if (e.success === undefined || e.success) {
    if (typeof (callback) === 'function') {
      if (timout) clearTimeout(timeout);
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
  if (e.success === undefined || e.success) {
    if (typeof (callback) === 'function') {      
      // Close the listener after getting a GPS reading.
      if(e.provider && e.provider.name == 'gps') stop();
              
      setLocation(e);
      log();      
    }
  }    
}

function setLocation(e) {
  location.latitude = e.coords.latitude;
  location.longitude = e.coords.longitude;
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
  
  Ti.Geolocation.Android.manualMode = true;
  gpsProvider = Ti.Geolocation.Android.createLocationProvider({
    name : Ti.Geolocation.PROVIDER_GPS
  });
  Ti.Geolocation.Android.addLocationProvider(gpsProvider);
   
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
