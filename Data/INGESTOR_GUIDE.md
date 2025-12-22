# CSV Ingestor Guide

## Purpose

This tool converts CSV data from field boss spawn tracking into the JSON format used by the application.

## How to Use

1. **Open the Ingestor**

   - Open `ingestor.html` in your web browser
   - You can do this by double-clicking the file or using a live server

2. **Prepare Your CSV Data**

   - The CSV should be in this format:
     ```
     Boss,time (xx:xx),day of the week,,Boss,Time (xx:xx),Day of the week
     Skypetal Plains,10:02,Friday,,Profane,23:08,Sunday
     Skypetal Plains,14:30,Friday,,,,
     ```
   - First 3 columns: Silverfrost region data (Boss location, time, day)
   - Column 4: Empty (separator)
   - Columns 5-7: Moonwater region data (Boss location, time, day)

3. **Convert the Data**

   - Copy your CSV data from `Data/Patch XX-XX-XX/` folder
   - Paste it into the textarea in the ingestor
   - Click "Convert to JSON"
   - The tool will show statistics and the generated JSON

4. **Save the Result**
   - Click "Copy JSON to Clipboard"
   - Save it as `bosses.json` in the root directory
   - This will update the timer with new spawn data

## Features

- ✅ Automatically sorts spawns by time
- ✅ Supports both Silverfrost and Moonwater regions
- ✅ Shows statistics (total spawns, region breakdown, days with data)
- ✅ Client-side only - no data leaves your browser
- ✅ GitHub Pages compatible

## Data Format

The output JSON has this structure:

```json
{
  "Silverfrost": {
    "Monday": [
      { "time": "10:15", "location": "Skypetal Plains" }
    ],
    ...
  },
  "Moonwater": {
    "Monday": [],
    ...
  }
}
```

## Notes

- Empty days will have empty arrays `[]`
- All spawns are automatically sorted by time within each day
- The main app (`index.html`) reads `bosses.json` and displays only the current day's spawns
- The app updates automatically at midnight to show the new day
