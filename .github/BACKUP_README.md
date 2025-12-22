# Automated Google Sheets Backup

## What This Does

The GitHub Actions workflow automatically:

- ✅ Downloads your Google Sheet as CSV **every day at 3 AM UTC**
- ✅ Saves it to `Data/Patch-YYYY-MM-DD/` folder
- ✅ Commits and pushes to GitHub automatically
- ✅ Protects against griefers - you always have daily backups!

## How It Works

### File: `.github/workflows/backup-sheets.yml`

- Runs on a schedule (daily at 3 AM UTC)
- Downloads the sheet using Google's CSV export URL
- Only commits if the data actually changed
- Uses GitHub's built-in authentication (no API keys needed!)

## Important: Make Your Sheet Publicly Viewable

For this to work, your Google Sheet must be set to:

- **"Anyone with the link can VIEW"** (not edit, just view!)

To set this:

1. Open your sheet: https://docs.google.com/spreadsheets/d/1unXxTlJ53VZBLMOs7XtpWqMyWC7WYHQ0KN3MmqejGIY/edit
2. Click "Share" button
3. Change to "Anyone with the link" → **Viewer**
4. Save

## Manual Trigger

You can also run the backup manually:

1. Go to your GitHub repo → **Actions** tab
2. Click "Daily Google Sheets Backup"
3. Click "Run workflow"

## Customization

### Change Backup Time

Edit `.github/workflows/backup-sheets.yml`, line 5:

```yaml
- cron: "0 3 * * *" # 3 AM UTC
```

Examples:

- `0 0 * * *` = Midnight UTC
- `0 12 * * *` = Noon UTC
- `0 */6 * * *` = Every 6 hours

### Change Folder Structure

Edit line 19 in the workflow:

```bash
PATCH_DIR="Data/Patch-${DATE}"
```

## View Backup History

All backups are stored in:

```
Data/
  Patch-2025-12-22/
  Patch-2025-12-23/
  Patch-2025-12-24/
  ...
```

You can always go back to any date's data!

## Anti-Griefing Protection

Even if someone messes with your live Google Sheet:

- ✅ Yesterday's data is safe in GitHub
- ✅ You can restore from any previous day
- ✅ Full version history via Git commits
- ✅ Can compare changes over time

## First Run

After pushing this workflow:

1. Go to **Actions** tab in GitHub
2. Click "Daily Google Sheets Backup"
3. Click "Run workflow" → "Run workflow" to test it now
4. Check `Data/` folder for the new backup!
