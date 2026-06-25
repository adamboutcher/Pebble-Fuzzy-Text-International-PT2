# Fuzzy Text International 2 — Agent Guide

A Pebble watchface that shows the time as natural language ("quarter past three") in eleven languages. Built with Pebble SDK 3 (C + JavaScript).

## Build

```bash
npm install          # install pebble-clay (clay branch) or no-op on main
pebble build         # compiles the .pbw watchapp
pebble install       # install to connected Pebble (optional)
```

Requires the Pebble SDK toolchain. The build system is `waf`; `pebble build` is the only command needed.

Add `node_modules/` is git-ignored — run `npm install` after cloning.

## Project Layout

```
src/c/
  TextWatch.c          — main watchface: UI, tick handler, AppMessage/AppSync
  num2words.h          — ALL_LANGUAGES X-macro, Language enum, public API
  num2words.c          — time/date → words, LangStrings struct dispatch
  strings-XX.h/.c      — per-language hour names, phrases, date data
src/pkjs/
  pebble-js-app.js     — phone-side JS: config glue (or Clay init on clay branch)
  clay-config.js       — Clay UI definition (clay branch only)
  config-html.js       — legacy embedded HTML config (main branch only)
fonts/
  large_bold.ttf / large_light.ttf
```

## AppMessage Keys (C ↔ JS)

Defined in `src/c/TextWatch.c` lines 19–24 and sent from `pebble-js-app.js`:

| Key | Integer | Setting |
|-----|---------|---------|
| `INVERT_KEY` | 0 | Invert colours (0/1) |
| `TEXT_ALIGN_KEY` | 1 | Alignment: 0=center 1=left 2=right |
| `LANGUAGE_KEY` | 2 | Language integer (see below) |
| `FONT_SIZE_KEY` | 3 | 0=small 1=medium 2=large |
| `SHOW_DATE_KEY` | 4 | Show date on shake (0/1) |
| `DATE_TIMEOUT_KEY` | 5 | 0=3s 1=5s 2=8s 3=60s 4=never |

The C side reads each as `new_tuple->value->uint8`.

## Language System

### ALL_LANGUAGES X-macro (`num2words.h`)

Every language is registered with one line:

```c
X(EN_US, 0x3)
//^enum  ^integer sent from JS (must match pebble-js-app.js)
```

This single macro drives:
- The `Language` enum (`EN_US = 3`)
- The `lang_strings[]` static initialiser in `num2words.c`
- The `get_date_suffix` switch via `date_suffix_##ENUM`

### LangStrings struct (`num2words.c`)

All per-language data is stored in a compile-time table:

```c
typedef struct {
  const char* const* hours;       // 24 hour names (12 AM + 12 PM)
  const char* const* rels;        // 12 five-minute-interval phrases
  const char* const* days;        // 7 day abbreviations
  const char* const* months;      // 12 month abbreviations
  const char* date_format;        // "$1  $2 $3 " — $1=day $2=month $3=date+suffix
} LangStrings;

static const LangStrings lang_strings[] = {
  #define X(ENUM, VAL) [ENUM] = { HOURS_##ENUM, RELS_##ENUM, DAYS_##ENUM, MONTHS_##ENUM, DATE_FORMAT_##ENUM },
  ALL_LANGUAGES
  #undef X
};
```

All values **must be constant expressions** (array addresses or string literals). Pointer variables are not constant expressions and will cause a build error. Use:
- `const char ARRAY[]` — ✓ array address is constant
- `#define ALIAS OTHER_ARRAY` — ✓ macro expands to array name
- `const char* ptr` — ✗ pointer value is not constant

### Language file conventions

Languages that share English day/month names and date format use `#define` aliases in the header, keeping the `.c` file to just `HOURS_XX` and `RELS_XX`:

```c
// strings-es.h
#pragma once
#include "strings-en_US.h"

#define DAYS_ES          DAYS_EN_US
#define MONTHS_ES        MONTHS_EN_US
#define DATE_FORMAT_ES   "$1  $2 $3 "
#define date_suffix_ES   date_suffix_EN_US

extern const char* const HOURS_ES[24];
extern const char* const RELS_ES[12];
```

Languages with their own date data (DE, EN_GB) declare real arrays:

```c
// strings-de.h
extern const char* const MONTHS_DE[12];
extern const char* const DAYS_DE[7];
extern const char DATE_FORMAT_DE[];     // must be char[], NOT char* const
const char* date_suffix_DE(int date);
```

### RELS phrase format

`RELS_XX[12]` covers twelve five-minute intervals starting at the hour:

```c
"*$1 o'clock",        // :00 — $1 = current hour, * = bold
"five after *$1",     // :05
...
"twenty five to *$2", // :35 — $2 = next hour
...
"five to *$2"         // :55
```

`$1` → current hour name, `$2` → next hour name, `*word` → render word bold.

## Adding a New Language

1. **`src/c/strings-XX.h`** — declare arrays and `#define` any shared defaults:
   ```c
   #pragma once
   #include "strings-en_US.h"
   #define DAYS_XX         DAYS_EN_US
   #define MONTHS_XX       MONTHS_EN_US
   #define DATE_FORMAT_XX  "$1  $2 $3 "
   #define date_suffix_XX  date_suffix_EN_US
   extern const char* const HOURS_XX[24];
   extern const char* const RELS_XX[12];
   ```
   If the language needs its own day/month names or date order, define real `char[]` arrays and a `date_suffix_XX` function instead (see `strings-de.h`).

2. **`src/c/strings-XX.c`** — define `HOURS_XX[24]` and `RELS_XX[12]`.

3. **`src/c/num2words.h`** — add one row to `ALL_LANGUAGES`:
   ```c
   X(XX, 0xN)   // N must be unique and match the JS value below
   ```

4. **`src/c/num2words.c`** — add `#include "strings-XX.h"`.

5. **`src/pkjs/pebble-js-app.js`** (main branch) — add `xx: N` to the `langs` map and add an `<option>` to `config-html.js`.
   **`src/pkjs/clay-config.js`** (clay branch) — add an entry to the language `options` array.

## Active Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable, releasable code |
| `improvements` | Completes struct-based dispatch for `get_day`/`get_month`/`get_date_format`; replaces trivial `date_suffix` functions with `#define` aliases |
| `clay` | Replaces embedded HTML config page with Pebble Clay settings UI |

## Git Conventions

- Commit author: `Claude <noreply@anthropic.com>`
- `git push` via proxy may return 503 for force-pushes; use the GitHub MCP `push_files` tool instead
- After an MCP push, run `git fetch origin <branch> && git reset --hard origin/<branch>` to re-sync local HEAD
