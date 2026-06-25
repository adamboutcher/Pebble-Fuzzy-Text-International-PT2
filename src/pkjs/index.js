var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e || !e.response) { return; }
  var s = clay.getSettings(e.response);
  // Delay to let the watch's AppSync re-init message clear the outbox
  // before we send; without this the outbox is busy and the message is dropped.
  setTimeout(function() {
    Pebble.sendAppMessage({
      0: s.invert    ? 1 : 0,
      1: parseInt(s.text_align,   10),
      2: parseInt(s.lang,         10),
      3: parseInt(s.font_size,    10),
      4: s.show_date ? 1 : 0,
      5: parseInt(s.date_timeout, 10)
    }, function() {
      console.log('Settings sent');
    }, function(err) {
      console.log('Error sending settings: ' + JSON.stringify(err));
    });
  }, 200);
});
