#pragma once
#include "strings-en_US.h"

#define DATE_FORMAT_NL "$1  $2 $3 "

extern const char* const HOURS_NL[24];
extern const char* const RELS_NL[12];
extern const char* const DAYS_NL[7];
extern const char* const MONTHS_NL[12];

const char* date_suffix_NL(int date);
