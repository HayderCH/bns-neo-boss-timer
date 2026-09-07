# Tools — Python Data Engineering Utilities

This directory contains Python scripts for processing and merging community-submitted boss spawn data into the production `bosses.json` file.

## 🛠️ Overview

These tools form the **ETL (Extract, Transform, Load)** layer between raw community CSV submissions and the structured JSON data served by the live site.

```
Raw CSV submissions
      │
      ▼
check_patch_vs_bosses.py   (validate: no conflicts with existing data)
      │
      ▼
merge_patch.py             (merge new CSV data into bosses.json format)
      │
      ▼
apply_proposed_entries.py  (apply approved proposals to bosses.json)
      │
      ▼
apply_safe_patch_to_bosses.py  (safe application with backup + rollback)
      │
      ▼
bosses.json (updated production data)
```

## 📄 Scripts

### `check_patch_vs_bosses.py`
Validates a proposed CSV patch against the existing `bosses.json` to detect conflicts, duplicate times, and schema issues **before** applying anything.

```bash
python tools/check_patch_vs_bosses.py --patch Data/Submissions/new_times.csv
```

### `merge_patch.py`
Converts a CSV file into `bosses.json`-compatible JSON entries, applying the confidence scoring schema and merging with existing data without overwriting verified entries.

```bash
python tools/merge_patch.py --input Data/Latest/BNS_NEO_fb_times_EU.csv --output bosses.json
```

### `apply_proposed_entries.py`
Applies a set of proposed boss time entries (after manual review) to `bosses.json`, respecting confidence levels and existing verified data.

```bash
python tools/apply_proposed_entries.py --proposals Data/Submissions/proposals.json
```

### `apply_safe_patch_to_bosses.py`
Safest mode: creates a timestamped backup of `bosses.json` before patching, then applies changes. Rolls back automatically if the resulting JSON fails schema validation.

```bash
python tools/apply_safe_patch_to_bosses.py --patch Data/Submissions/patch.csv
```

## 🔒 Safety Features

- **Automatic backups** before any write operation
- **JSON schema validation** post-patch (time format, confidence range, required fields)
- **Dry-run mode** available — shows what would change without writing
- **Conflict detection** — never overwrites `"verified": true` entries without explicit flag

## 🔗 Related

- See `Data/README.md` for the full pipeline overview
- See `Data/Analysis/boss_timer_analysis.ipynb` for the statistical analysis notebook
- See `.github/workflows/backup-sheets.yml` for the automated backup pipeline
