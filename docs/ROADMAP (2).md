# Blade & Soul Neo EU Field Boss Timer (Static) — ROADMAP

Target deploy: **GitHub Pages** (public URL anyone can open)

Current date reference: **2025-12-19**

---

## 0) Goals (Definition of Done)

- [ ] Website loads as a fully static site (HTML/CSS/JS + `bosses.json`)
- [ ] Boss schedule is loaded via `fetch('bosses.json')`
- [ ] Each boss shows a live countdown (updates every second)
- [ ] Bosses spawning within next **5 minutes** are highlighted + play alarm sound
- [ ] When timer hits 0: show **SPAWNING** and start a 5-minute spawning timer with purple color
- [ ] When the 5-minute spawning timer ends: retrieve time of next boss, calculate countdown, and display
- [ ] Volume slider adjusts sound volume
- [ ] Easy to add/edit bosses by updating **JSON only** (no JS edits)
- [ ] Works on GitHub Pages (no backend)

---

## 1) Repo Setup

- [ ] Create repo: `bns-neo-boss-timer`
- [ ] Add files:
  - `index.html`
  - `styles.css`
  - `script.js`
  - `bosses.json`
  - `README.md`
  - `docs/CONTRIBUTING.md`
  - `assets/notification.mp3` (optional; you can add later)

Recommended structure:

```
/
  index.html
  styles.css
  script.js
  bosses.json
  assets/
    notification.mp3
  docs/
    CONTRIBUTING.md
  README.md
  ROADMAP.md
```

---

## 2) Data Model (bosses.json)

- [ ] Maintain this shape:

```json
{
  "Silverfrost": [
    { "name": "Skypetl Plains", "spawn": "2025-12-19T14:30:00" },
    { "name": "Primeval Forest", "spawn": "2025-12-19T16:00:00" }
  ],
  "Moonwater Plains": [
    { "name": "Sajifi", "spawn": "2025-12-19T14:30:00" },
    { "name": "Kaari", "spawn": "2025-12-19T16:00:00" }
  ]
}
```

Notes:

- `spawn` is ISO-like datetime (no timezone). The browser will interpret it as **local time**.
- If you want EU-specific correctness for all viewers worldwide later, we can add timezone handling.

---

## 3) UI/UX

- [ ] Region sections with boss lists
- [ ] Each boss row shows:
  - Boss name
  - Spawn datetime (optional display)
  - Countdown text
- [ ] Visual states:
  - Normal (more than 5 minutes away)
  - **Soon** (<= 5 minutes, alarm plays)
  - **Spawning** (<= 0 seconds, show "spawning", 5-minute purple timer)
  - **Next** (after spawning timer ends, countdown to next boss)

---

## 4) JavaScript Milestones

### 4.1 Load Data

- [ ] `loadBosses()` fetches `bosses.json`, validates shape, returns data

### 4.2 Render DOM

- [ ] `renderBossList(data)` creates `<li>` rows automatically (so you don’t manually maintain IDs)

### 4.3 Timer Loop

- [ ] `startTimerLoop()` calls `updateAllCountdowns()` every second
- [ ] `updateAllCountdowns()`:
  - computes time remaining
  - updates `<li>` content
  - applies CSS classes (`soon`, `spawning`, `next`)
  - triggers sound when entering "soon" state (<=5 min)
  - when timer hits 0, start 5-min spawning timer with purple color
  - when spawning timer ends, calculate and display countdown to next boss

### 4.4 Sound + Volume

- [ ] `setupAudio()` wires slider -> audio volume
- [ ] Play alarm sound when boss enters "soon" state (<=5 min)
- [ ] Handle autoplay restrictions by requiring first user interaction (click)

---

## 5) GitHub Pages Deployment

- [ ] Repo → **Settings** → **Pages**
- [ ] Source: **Deploy from a branch**
- [ ] Branch: `main`, Folder: `/ (root)`
- [ ] Your site URL will be:
  - `https://HayderCH.github.io/bns-neo-boss-timer/`

---

## 6) Future Improvements (Optional)

- [ ] Timezone selector (EU server time vs viewer local time)
- [ ] Desktop notifications (Web Notifications API)
- [ ] Sort bosses by soonest spawn
- [ ] Search/filter by region/boss
- [ ] PWA offline caching (service worker)

---

## 7) Testing Checklist

- [ ] Timers tick every second
- [ ] "Soon" highlight shows at 5:00 remaining, alarm plays
- [ ] When timer hits 0, shows "spawning" and starts 5-min purple timer
- [ ] When spawning timer ends, counts down to next boss
- [ ] Volume slider works
- [ ] Refreshing the page keeps working (no cached stale issues)
- [ ] GitHub Pages loads `bosses.json` correctly (no CORS issues)
