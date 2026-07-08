#include "strings-nl.h"

const char* const HOURS_NL[] = {
  /* AM */
  "twaalf", "een", "twee", "drie", "vier", "vijf",
  "zes", "zeven", "acht", "negen", "tien", "elf",
  /* PM */
  "twaalf", "een", "twee", "drie", "vier", "vijf",
  "zes", "zeven", "acht", "negen", "tien", "elf"
};

/* $1 = current hour, $2 = next hour, * = bold */
const char* const RELS_NL[] = {
  "*$1 uur",
  "vijf over *$1",
  "tien over *$1",
  "kwart over *$1",
  "tien voor half *$2",
  "vijf voor half *$2",
  "half *$2",
  "vijf over half *$2",
  "tien over half *$2",
  "kwart voor *$2",
  "tien voor *$2",
  "vijf voor *$2"
};

const char* const DAYS_NL[] = {
  "zon",
  "man",
  "din",
  "woe",
  "don",
  "vri",
  "zat"
};

const char* const MONTHS_NL[] = {
  "jan",
  "feb",
  "mar",
  "apr",
  "mei",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "dec"
};

const char* date_suffix_NL(int date) { return ""; }
