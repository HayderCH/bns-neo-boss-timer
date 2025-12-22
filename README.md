# Blade & Soul Neo EU Field Boss Timer

A static web application for tracking Field Boss spawn times in Blade & Soul Neo EU server.

## Features

- **Day-Based Schedule**: Shows only today's field boss spawns (automatically updates at midnight)
- **Multiple Regions**: Separate tables for Silverfrost and Moonwater regions
- **Live Countdown Timers**: Each boss shows a real-time countdown to their spawn
- **Visual State Indicators**:
  - **Normal** (gray): More than 5 minutes until spawn
  - **Soon** (pink, pulsing): Within 5 minutes - alarm plays!
  - **Spawning** (purple): Boss just spawned, 5-minute spawning window timer
  - **Done** (faded): Spawn window has ended
- **Audio Alerts**: Alarm sounds when boss enters the "Soon" state (5 minutes before alarm)
- **Volume Control**: Adjustable volume slider for notifications
- **Browser Notifications**: Desktop notifications for boss spawns (opt-in)
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Export to Calendar**: Download today's spawns as ICS file
- **Progressive Web App**: Install on mobile/desktop, works offline
- **CSV Ingestor**: Easy tool to convert CSV tracking data to JSON format

## How It Works

1. Load the page and click anywhere to enable sound
2. The app automatically shows only **today's** boss spawns
3. Boss timers count down in real-time
4. When a timer reaches 5 minutes remaining, it turns **pink** and plays an alarm
5. When the timer hits 0, it shows **"SPAWNING"** with a purple 5-minute timer
6. After the spawning window, it shows **"DONE"**
7. At midnight, the page automatically updates to show the next day's schedule

## Setup

1. Clone or download this repository
2. Edit `bosses.json` to update boss spawn times (or use the ingestor)
3. Add a notification sound as `assets/notification.mp3` (optional)
4. Open `index.html` in a browser or deploy to GitHub Pages

## Editing Boss Schedules

### Option 1: Use the CSV Ingestor (Recommended)

1. Open `ingestor.html` in your browser
2. Paste your CSV data (format: Boss,time,day of week)
3. Click "Convert to JSON"
4. Copy the generated JSON and save it as `bosses.json`

See `Data/INGESTOR_GUIDE.md` for detailed instructions.

### Option 2: Manual Edit

Update `bosses.json` with your boss data:

```json
{
  "Silverfrost": {
    "Monday": [
      { "time": "10:15", "location": "Skypetal Plains" },
      { "time": "14:30", "location": "Primeval Forest" }
    ],
    "Tuesday": [],
    ...
  },
  "Moonwater": {
    "Monday": [],
    ...
  }
}
```

- Each region has 7 days: Monday through Sunday
- Each day has an array of spawns with `time` (HH:MM format) and `location`
- Empty days have empty arrays `[]`

## Deployment (GitHub Pages)

1. Push to GitHub
2. Go to **Settings** → **Pages**
3. Set source to **main** branch, **/ (root)** folder
4. Your timer will be live at `https://yourusername.github.io/repo-name/`

**Note**: This is a fully static site - no server required, completely free to host on GitHub Pages!

## Project Structure

```
├── index.html          # Main application
├── script.js           # Timer logic and day-based filtering
├── styles.css          # Styling
├── bosses.json         # Boss spawn data (day-based)
├── ingestor.html       # CSV to JSON converter tool
├── assets/             # Audio files
├── Data/
│   ├── Placeholder/    # Old placeholder data
│   ├── Patch XX-XX-XX/ # CSV source data from game
│   └── INGESTOR_GUIDE.md
└── README.md
```

## License

MIT License
