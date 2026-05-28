module.exports = [
  {
    'type': 'heading',
    'defaultValue': "Fuzzy Text Int'l"
  },
  {
    'type': 'toggle',
    'messageKey': 'INVERT_KEY',
    'label': 'Invert Colors',
    'defaultValue': false
  },
  {
    'type': 'toggle',
    'messageKey': 'SHOW_DATE_KEY',
    'label': 'Shake to Show Date',
    'defaultValue': true
  },
  {
    'type': 'select',
    'messageKey': 'DATE_TIMEOUT_KEY',
    'label': 'Date View Timeout',
    'defaultValue': 3,
    'options': [
      {'label': '3 seconds',      'value': 0},
      {'label': '5 seconds',      'value': 1},
      {'label': '8 seconds',      'value': 2},
      {'label': '1 minute',       'value': 3},
      {'label': 'Never (manual)', 'value': 4}
    ]
  },
  {
    'type': 'radiogroup',
    'messageKey': 'TEXT_ALIGN_KEY',
    'label': 'Text Align',
    'defaultValue': 0,
    'options': [
      {'label': 'Center', 'value': 0},
      {'label': 'Left',   'value': 1},
      {'label': 'Right',  'value': 2}
    ]
  },
  {
    'type': 'radiogroup',
    'messageKey': 'FONT_SIZE_KEY',
    'label': 'Font Size',
    'defaultValue': 2,
    'options': [
      {'label': 'Large',  'value': 2},
      {'label': 'Medium', 'value': 1},
      {'label': 'Small',  'value': 0}
    ]
  },
  {
    'type': 'select',
    'messageKey': 'LANGUAGE_KEY',
    'label': 'Language',
    'defaultValue': 3,
    'options': [
      {'label': 'Català',                  'value': 0},
      {'label': 'Deutsch',                 'value': 1},
      {'label': 'English (Great Britain)', 'value': 2},
      {'label': 'English (United States)', 'value': 3},
      {'label': 'Español',                 'value': 4},
      {'label': 'Français',                'value': 5},
      {'label': 'Norsk',                   'value': 6},
      {'label': 'Svenska',                 'value': 7}
    ]
  }
];
