# How to Organize Backups

## Folder Structure

```
Data/
├── Backups/
│   ├── Daily-2025-12-22/  # Automatic daily backups
│   ├── Daily-2025-12-23/
│   └── Daily-2025-12-24/
├── Latest/                 # Always has newest data
│   └── BNS_NEO_fb_times_EU.csv
└── Patch 12-17-25/        # Manual patch folders (YOU create these)
    └── BNS_NEO_fb_times_EU.csv
```

## When a New Game Patch Drops

### Example: New patch on January 15, 2025

1. **Create new patch folder manually:**
   ```bash
   mkdir "Data/Patch 01-15-25"
   ```

2. **Copy the latest data:**
   ```bash
   cp Data/Latest/BNS_NEO_fb_times_EU.csv "Data/Patch 01-15-25/"
   ```

3. **Commit it:**
   ```bash
   git add "Data/Patch 01-15-25"
   git commit -m "New patch 01-15-25 baseline data"
   git push
   ```

### Or Just Use Windows Explorer:
1. Go to `Data/Latest/` folder
2. Copy the CSV file
3. Create new folder: `Data/Patch 01-15-25/`
4. Paste the CSV there
5. Commit and push via Git

## What Gets Updated Automatically

✅ **Daily backups**: `Data/Backups/Daily-YYYY-MM-DD/` (every day at 3 AM)
✅ **Latest data**: `Data/Latest/` (updated daily, always current)

❌ **Patch folders**: YOU create these manually when a new game patch releases

## Why This Way?

- **Daily backups protect against griefers** - you can restore any day
- **Latest folder** gives you the current data for the ingestor tool
- **Manual patch folders** let you preserve data when BNS patches change boss mechanics

## Quick Commands

### When new patch drops:
```bash
# Copy latest to new patch folder
$PATCH="Patch 01-15-25"
mkdir "Data/$PATCH"
cp Data/Latest/BNS_NEO_fb_times_EU.csv "Data/$PATCH/"
git add "Data/$PATCH"
git commit -m "Archive data for $PATCH"
git push
```

### Restore from a backup:
```bash
# If someone griefed your sheet, restore from backup
cp "Data/Backups/Daily-2025-12-22/BNS_NEO_fb_times_EU.csv" "Data/Latest/"
```
