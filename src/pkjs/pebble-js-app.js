var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});

function toMessage(s) {
  return {
    '0': s.invert    ? 1 : 0,
    '1': Number(s.text_align),
    '2': Number(s.lang),
    '3': Number(s.font_size),
    '4': s.show_date ? 1 : 0,
    '5': Number(s.date_timeout)
  };
}

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e.response) { return; }
  var s = clay.getSettings(e.response);
  Pebble.sendAppMessage(toMessage(s), function() {}, function(err) {
    console.log('Error sending settings: ' + err.error.message);
  });
});

Pebble.addEventListener('ready', function() {
  Pebble.sendAppMessage(toMessage(clay.getSettings()), function() {}, function(err) {
    console.log('Error sending settings: ' + err.error.message);
  });
});
