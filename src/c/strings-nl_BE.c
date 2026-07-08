#include "strings-nl_BE.h"

// Flemish (Belgian Dutch). Hours are shared with Dutch (HOURS_NL).
/* $1 = current hour, $2 = next hour, * = bold */
const char* const RELS_NL_BE[] = {
  "*$1 uur",
  "vijf over *$1",
  "tien over *$1",
  "kwart over *$1",
  "twintig over *$1",
  "vijf voor half *$2",
  "half *$2",
  "vijf over half *$2",
  "twintig voor *$2",
  "kwart voor *$2",
  "tien voor *$2",
  "vijf voor *$2"
};

const char* date_suffix_NL_BE(int date) { return ""; }
