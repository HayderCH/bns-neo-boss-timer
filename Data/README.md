# Data Directory — Community Data Pipeline

This directory contains all community-submitted and automatically-backed-up field boss spawn data for BNS Neo EU and NA servers.

## 🔄 Data Pipeline Overview

```
Community Players
      │
      ▼
Google Form / Boss Submission Modal (index.html)
      │  (HTTP POST via Google Apps Script REST API)
      ▼
Google Sheets (community source of truth)
      │
      ▼ (GitHub Actions cron — daily at 3 AM UTC)
Data/Backups/Daily-YYYY-MM-DD/BNS_NEO_fb_times_EU.csv
Data/Latest/BNS_NEO_fb_times_EU.csv
      │
      ▼ (manual review + Python ETL tools)
bosses.json (production data with confidence scores)
      │
      ▼
GitHub Pages — live site
```

## 📂 Directory Structure

```
Data/
├── Latest/             # Most recent CSV from the community Google Sheet
├── Backups/            # Daily automated backups (one folder per day)
├── Submissions/        # Raw boss time submissions from the community
├── Processed/          # CSVs that have been reviewed and merged
├── Archives/           # Historical data from past game patches
├── Analysis/           # Jupyter notebook for spawn time statistical analysis
│   └── boss_timer_analysis.ipynb
└── Patch 12-17-25/    # Patch-specific spawn data folders
```

## 📊 bosses.json Schema

Each boss entry uses this schema:

```json
{
  "time": "14:29",
  "location": "Earthbreaker Mountains",
  "confidence": 100,
  "verified": true
}
```

| Field | Type | Description |
|---|---|---|
| `time` | `"HH:MM"` | Spawn time in EU Server Time (UTC+1) |
| `location` | `string` | In-game location name, or `"Unknown"` |
| `confidence` | `number (0–100)` | Community confidence score — 100 = multiple verified sightings |
| `verified` | `boolean` | Cross-referenced and confirmed |

## 🤖 Automated Backup

The GitHub Actions workflow (`.github/workflows/backup-sheets.yml`) runs **daily at 3 AM UTC** and:
1. Downloads the community Google Sheet as CSV via `curl`
2. Saves it to `Data/Backups/Daily-{date}/` and `Data/Latest/`
3. Auto-commits and pushes if changes are detected

This creates a **full git-versioned history** of every community submission — every change is auditable.

## 🔬 Data Science

`Data/Analysis/boss_timer_analysis.ipynb` is a Jupyter notebook that:
- Loads submission data from the community CSV
- Analyzes spawn time patterns statistically
- Calculates confidence scores
- Identifies location patterns across days of the week
- Generates the verified/unverified flags used in `bosses.json`

## 🌍 Data Quality — Confidence Scoring

| Confidence | Meaning |
|---|---|
| 100 | Verified by multiple independent community members |
| 75–99 | Consistent with known patterns, 1–2 sightings |
| 50–74 | Single report, plausible but unverified |
| < 50 | Estimated based on known spawn intervals |

---

*This pipeline runs entirely on free infrastructure: Google Sheets + GitHub Actions + GitHub Pages. Zero server costs.*
