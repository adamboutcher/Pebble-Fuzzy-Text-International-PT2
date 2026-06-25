module.exports = [
  {
    "type": "heading",
    "defaultValue": "Fuzzy Text International 2"
  },
  {
    "type": "toggle",
    "messageKey": "invert",
    "label": "Invert colors",
    "defaultValue": false
  },
  {
    "type": "toggle",
    "messageKey": "show_date",
    "label": "Show date on shake",
    "defaultValue": true
  },
  {
    "type": "select",
    "messageKey": "date_timeout",
    "label": "Date view timeout",
    "defaultValue": 3,
    "options": [
      { "label": "3 seconds",  "value": 0 },
      { "label": "5 seconds",  "value": 1 },
      { "label": "8 seconds",  "value": 2 },
      { "label": "60 seconds", "value": 3 },
      { "label": "Never",      "value": 4 }
    ]
  },
  {
    "type": "select",
    "messageKey": "text_align",
    "label": "Text alignment",
    "defaultValue": 0,
    "options": [
      { "label": "Center", "value": 0 },
      { "label": "Left",   "value": 1 },
      { "label": "Right",  "value": 2 }
    ]
  },
  {
    "type": "select",
    "messageKey": "font_size",
    "label": "Font size",
    "defaultValue": 1,
    "options": [
      { "label": "Small",  "value": 0 },
      { "label": "Medium", "value": 1 },
      { "label": "Large",  "value": 2 }
    ]
  },
  {
    "type": "submit",
    "defaultValue": "Save Settings"
  },
  {
    "type": "select",
    "messageKey": "lang",
    "label": "Language",
    "defaultValue": 3,
    "options": [
      { "label": "Català",                  "value": 0  },
      { "label": "Deutsch",                 "value": 1  },
      { "label": "Deutsch (Alternative)",   "value": 10 },
      { "label": "English (Great Britain)", "value": 2  },
      { "label": "English (United States)", "value": 3  },
      { "label": "Español",                 "value": 4  },
      { "label": "Français",                "value": 5  },
      { "label": "Nederlands",              "value": 8  },
      { "label": "Norsk",                   "value": 6  },
      { "label": "Português",               "value": 9  },
      { "label": "Svenska",                 "value": 7  }
    ]
  }
];
