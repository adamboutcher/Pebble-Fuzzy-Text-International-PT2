var Clay = require('pebble-clay');
var clayConfig = require('./config');

var clay = new Clay(clayConfig);

// Re-send stored settings to the watch on startup so phone and watch
// stay in sync after a reinstall or persistent-storage wipe.
Pebble.addEventListener('ready', function() {
  var stored = localStorage.getItem('clay-settings');
  if (stored) {
    Pebble.sendAppMessage(
      Clay.prepareSettingsForAppMessage(JSON.parse(stored)),
      function() {},
      function(e) { console.log('Failed to send settings: ' + JSON.stringify(e)); }
    );
  }
});
