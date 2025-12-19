# Blade & Soul Neo EU Field Boss Timer

A static web application for tracking Field Boss spawn times in Blade & Soul Neo EU server.

## Features

- **Live Countdown Timers**: Each boss shows a real-time countdown to their next spawn
- **Visual State Indicators**:
  - **Normal** (gray): More than 5 minutes until spawn
  - **Soon** (pink, pulsing): Within 5 minutes - alarm plays!
  - **Spawning** (purple): Boss just spawned, 5-minute spawning window timer
  - **Next** (blue): After spawning window, counting down to next spawn
- **Audio Alerts**: Alarm sounds when boss enters the "Soon" state (5 minutes before spawn)
- **Volume Control**: Adjustable volume slider for notifications
- **Auto-calculated**: Times automatically calculate the next spawn for each boss

## How It Works

1. Load the page and click anywhere to enable sound
2. Boss timers count down in real-time
3. When a timer reaches 5 minutes remaining, it turns **pink** and plays an alarm
4. When the timer hits 0, it shows **"SPAWNING"** with a purple 5-minute timer
5. After the spawning window, it automatically shows the countdown to the next spawn

## Setup

1. Clone or download this repository
2. Edit `bosses.json` to update boss spawn times
3. Add a notification sound as `assets/notification.mp3` (optional)
4. Open `index.html` in a browser or deploy to GitHub Pages

## Editing Boss Schedules

Update `bosses.json` with your boss data:

```json
{
  "Region Name": [
    { "name": "Boss Name", "spawns": ["14:30", "18:30", "22:30"] }
  ]
}
```

- `spawns`: Array of times in 24-hour format (HH:MM)
- Times are interpreted as local browser time

## Deployment (GitHub Pages)

1. Push to GitHub
2. Go to **Settings** → **Pages**
3. Set source to **main** branch, **/ (root)** folder
4. Your timer will be live at `https://yourusername.github.io/repo-name/`

## License

MIT License
