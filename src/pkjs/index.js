var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig, null, {autoHandleEvents: false});

Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e || !e.response) { return; }
  var s = clay.getSettings(e.response);
  Pebble.sendAppMessage({
    invert:       s.invert    ? 1 : 0,
    text_align:   parseInt(s.text_align,   10),
    lang:         parseInt(s.lang,         10),
    font_size:    parseInt(s.font_size,    10),
    show_date:    s.show_date ? 1 : 0,
    date_timeout: parseInt(s.date_timeout, 10)
  }, function() {}, function(err) {
    console.log('Error sending settings: ' + JSON.stringify(err));
  });
});
