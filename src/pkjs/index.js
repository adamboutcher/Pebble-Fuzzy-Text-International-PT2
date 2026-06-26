var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

function sendSettings(msg, retriesLeft) {
  Pebble.sendAppMessage(msg, function() {
    console.log('Settings sent');
  }, function(err) {
    console.log('sendAppMessage error (retries left: ' + retriesLeft + '): ' + JSON.stringify(err));
    if (retriesLeft > 0) {
      setTimeout(function() { sendSettings(msg, retriesLeft - 1); }, 500);
    }
  });
}

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e || !e.response) { return; }
  var s = clay.getSettings(e.response);
  // Send by messageKey name (not raw integers): the SDK maps these to the
  // generated key IDs that the C side listens on. Raw numeric keys get
  // scrambled by the SDK's key table when messageKeys is defined.
  var msg = {
    invert:       s.invert    ? 1 : 0,
    text_align:   parseInt(s.text_align,   10),
    lang:         parseInt(s.lang,         10),
    font_size:    parseInt(s.font_size,    10),
    show_date:    s.show_date ? 1 : 0,
    date_timeout: parseInt(s.date_timeout, 10)
  };
  // Initial delay lets the watch's AppSync re-init message clear the outbox.
  // sendSettings retries up to 5 times on busy/error for real Bluetooth hardware.
  setTimeout(function() { sendSettings(msg, 5); }, 200);
});
