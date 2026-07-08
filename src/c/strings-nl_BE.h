#pragma once
#include "strings-en_US.h"
#include "strings-nl.h"

// Flemish (Belgian Dutch). Hour, day and month names and the date format are
// all shared with Dutch (Netherlands).
#define DAYS_NL_BE        DAYS_NL
#define MONTHS_NL_BE      MONTHS_NL
#define DATE_FORMAT_NL_BE DATE_FORMAT_NL
#define HOURS_NL_BE       HOURS_NL

extern const char* const RELS_NL_BE[12];

const char* date_suffix_NL_BE(int date);
