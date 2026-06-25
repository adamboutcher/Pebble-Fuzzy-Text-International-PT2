var Clay = require('@rebble/clay');
var clayConfig = require('./clay-config');
var clay = new Clay(clayConfig);

// Send current settings to the watch on startup.
// Clay handles showConfiguration and webviewclosed automatically.
Pebble.addEventListener('ready', function() {
  var s = clay.getSettings();
  Pebble.sendAppMessage({
    '0': s.invert    ? 1 : 0,
    '1': Number(s.text_align),
    '2': Number(s.lang),
    '3': Number(s.font_size),
    '4': s.show_date ? 1 : 0,
    '5': Number(s.date_timeout)
  }, function() {}, function(e) {
    console.log('Error sending settings: ' + e.error.message);
  });
});
