# Quick Start Guide

## For Users - Viewing Boss Timers

1. Open `index.html` in any web browser
2. Click anywhere on the page to enable sound notifications
3. The page shows **only today's** field boss spawns
4. Timers will automatically update and notify you 5 minutes before spawns

## For Data Maintainers - Updating Boss Data

### Step 1: Collect Field Boss Data

- Track boss spawns in-game
- Note: Boss location, spawn time (HH:MM), and day of week
- Save data in CSV format like in `Data/Patch 12-17-25/` folder

### Step 2: Use the Ingestor Tool

1. Open `ingestor.html` in your browser
2. Copy your CSV data from the Data folder
3. Paste into the text area
4. Click "Convert to JSON"
5. Click "Copy JSON to Clipboard"

### Step 3: Update bosses.json

1. Open `bosses.json` in the root folder
2. Replace all content with the copied JSON
3. Save the file

### Step 4: Test

1. Refresh `index.html` in your browser
2. Verify that today's spawns are showing correctly
3. Check both Silverfrost and Moonwater regions

## CSV Format Reference

```csv
Boss,time (xx:xx),day of the week,,Boss,Time (xx:xx),Day of the week
Skypetal Plains,10:02,Friday,,Profane,23:08,Sunday
Skypetal Plains,14:30,Friday,,,,
Primeval Forest,11:54,Saturday,,,,
```

**Columns:**

- 1-3: Silverfrost region (Boss location, time, day)
- 4: Empty (separator)
- 5-7: Moonwater region (Boss location, time, day)

## Publishing Updates (GitHub Pages)

If you're the repo owner:

1. Commit the updated `bosses.json`
2. Push to GitHub
3. Changes go live automatically (GitHub Pages updates within minutes)

## Regions Supported

- **Silverfrost**: Primeval Forest, Skypetal Plains
- **Moonwater**: Profane (and others)

Add more regions by following the same structure in `bosses.json`.

## Need Help?

See:

- `Data/INGESTOR_GUIDE.md` - Detailed ingestor instructions
- `README.md` - Full project documentation
