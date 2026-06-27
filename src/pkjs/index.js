var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e || !e.response) { return; }
  // getSettings() returns a dict already keyed by message-key ID with values
  // converted for AppMessage — pass it straight through. Do NOT re-key by name
  // or parseInt it; the values aren't under s.<name> and that yields NaN.
  var dict = clay.getSettings(e.response);
  Pebble.sendAppMessage(dict, function() {
    console.log('Settings sent');
  }, function(err) {
    console.log('Error sending settings: ' + JSON.stringify(err));
  });
});
