# Fuzzy Text International 2 — Agent Guide

A Pebble watchface that shows the time as natural language ("quarter past three") in eleven languages. Built with Pebble SDK 3 (C + JavaScript).

## Build

```bash
npm install          # install @rebble/clay (clay branch only; no-op on main)
pebble build         # compiles the .pbw watchapp
pebble install       # install to connected Pebble (optional)
```

Requires the Pebble SDK toolchain. The build system is `waf`; `pebble build` is the only command needed.

`node_modules/` is git-ignored — run `npm install` after cloning.

## Project Layout

```
src/c/
  TextWatch.c          — main watchface: UI, tick handler, AppMessage/AppSync
  num2words.h          — ALL_LANGUAGES X-macro, Language enum, public API
  num2words.c          — time/date → words, LangStrings struct dispatch
  strings-XX.h/.c      — per-language hour names, phrases, date data
src/pkjs/
  index.js             — phone-side JS entry point: Clay init and AppMessage glue
  clay-config.js       — Clay UI component definitions (settings page layout)
fonts/
  large_bold.ttf / large_light.ttf
```

## AppMessage Keys (C ↔ JS)

Defined in `src/c/TextWatch.c` lines 19–24. The `messageKeys` array in `package.json` maps these names to integer indices — order must match the `#define` values in the C code:

| Key | Integer | Setting |
|-----|---------|-------|
| `INVERT_KEY` | 0 | Invert colours (0/1) |
| `TEXT_ALIGN_KEY` | 1 | Alignment: 0=center 1=left 2=right |
| `LANGUAGE_KEY` | 2 | Language integer (see below) |
| `FONT_SIZE_KEY` | 3 | 0=small 1=medium 2=large |
| `SHOW_DATE_KEY` | 4 | Show date on shake (0/1) |
| `DATE_TIMEOUT_KEY` | 5 | 0=3s 1=5s 2=8s 3=60s 4=never |

The C side reads each as `new_tuple->value->uint8`. Clay's `getSettings(e.response)` returns values keyed by messageKey name; Pebble's `sendAppMessage` resolves these to the correct integers automatically — do not manually remap to integer keys.

## Settings UI (Clay)

Settings are handled by [Pebble Clay](https://github.com/pebble/clay) via `@rebble/clay`.

`src/pkjs/index.js` initialises Clay with `autoHandleEvents: false` and wires up the two required events:

```js
Pebble.addEventListener('showConfiguration', function() {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function(e) {
  if (!e || !e.response) { return; }
  Pebble.sendAppMessage(clay.getSettings(e.response), ...);
});
```

`package.json` must have `"enableMultiJS": true` and `src/pkjs/index.js` must be the entry point (the SDK ignores other filenames when multiJS is on).

Do **not** add a `ready` event handler that sends settings — it overwrites the watch's persisted settings with Clay's localStorage defaults on every app launch.

## Language System

### ALL_LANGUAGES X-macro (`num2words.h`)

Every language is registered with one line:

```c
X(EN_US, 0x3)
//^enum  ^integer value in clay-config.js options array
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

Languages that share English day/month names and date format use `#define` aliases in the header, keeping the `.c` file to just `HOURS_XX` and `RELS_XX`. The `date_suffix` is also aliased rather than defining a trivial function:

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

Languages with their own date data (DE, EN_GB) declare real arrays and a real function:

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
   If the language needs its own day/month names, date order, or ordinal suffixes, define real `char[]` arrays and a `date_suffix_XX` function instead (see `strings-de.h`).

2. **`src/c/strings-XX.c`** — define `HOURS_XX[24]` and `RELS_XX[12]`. No `date_suffix` function needed if you used the `#define` alias in step 1.

3. **`src/c/num2words.h`** — add one row to `ALL_LANGUAGES`:
   ```c
   X(XX, 0xN)   // N must be unique and match the value in clay-config.js
   ```

4. **`src/c/num2words.c`** — add `#include "strings-XX.h"`.

5. **`src/pkjs/clay-config.js`** — add an entry to the language `options` array:
   ```js
   { "label": "Your Language", "value": N }
   ```
   Keep options sorted alphabetically by label.

## Active Branches

| Branch | Purpose |
|--------|---------|
| `main` | Stable, releasable code |
| `clay` | Active development: Pebble Clay settings UI; `index.js` entry point, `@rebble/clay` dependency |
| `claude/hopeful-pascal-60Bti` | This file (AGENTS.md) and its CLAUDE.md symlink only |

## Git Conventions

### Author setup

Before making any commits, configure the author so the stop hook passes:

```bash
git config user.email noreply@anthropic.com
git config user.name Claude
```

### Pushing

`git push` fails with 503 through this environment's proxy. Use the GitHub MCP `push_files` tool to push file content, then re-sync the local branch:

```bash
git fetch origin <branch> && git reset --hard origin/<branch>
```

### Fixing unverified commits

If the stop hook reports commits with unverified signatures, re-author all commits ahead of origin and re-push:

```bash
git config user.email noreply@anthropic.com && git config user.name Claude
git rebase --exec "git commit --amend --no-edit --reset-author" origin/<branch>
# then push via MCP push_files and git reset --hard origin/<branch>
```

## Common Pitfalls

- **`initializer element is not constant`** — a `const char*` pointer variable was used in the `lang_strings[]` initialiser. Change the declaration to `const char ARRAY[]` and the definition to match.
- **`conflicting type qualifiers`** — header declares `char[]` but source defines `char* const`. Keep both as `char[]`.
- **Settings overwrite on launch** — a `ready` handler that calls `clay.getSettings()` (no args) sends localStorage defaults to the watch on every startup, reverting any persisted changes. Remove it.
- **Wrong JS entry point** — with `enableMultiJS: true`, the Pebble SDK requires `src/pkjs/index.js` exactly. Any other filename is ignored.
- **`date_suffix` function vs `#define`** — languages without ordinal suffixes should use `#define date_suffix_XX date_suffix_EN_US`, not a function returning `""`. Functions cause linker duplication and don't satisfy the X-macro switch expansion correctly.
