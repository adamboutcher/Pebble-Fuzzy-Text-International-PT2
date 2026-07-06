#pragma once
#include "strings-en_US.h"
#include "strings-nl.h"

// Flemish (Belgian Dutch). Day/month names and date format follow the
// English defaults; the hour names are shared with Dutch (HOURS_NL).
#define DAYS_NL_BE        DAYS_EN_US
#define MONTHS_NL_BE      MONTHS_EN_US
#define DATE_FORMAT_NL_BE "$1  $2 $3 "
#define HOURS_NL_BE       HOURS_NL

extern const char* const RELS_NL_BE[12];

const char* date_suffix_NL_BE(int date);
