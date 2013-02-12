var LocationHelper = {
  setup : function() {
    Ti.Geolocation.Android.manualMode = true;
    
    gpsProvider = Ti.Geolocation.Android.createLocationProvider({
      name : Ti.Geolocation.PROVIDER_GPS,
      minUpdateTime : 60,
      minUpdateDistance : 100
    });
    
    Ti.Geolocation.Android.addLocationProvider(gpsProvider);
  }
};

module.exports = LocationHelper;
