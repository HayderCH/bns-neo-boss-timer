# Analytics Implementation Summary

## ✅ What's Been Implemented

### Files Created:

1. **analytics/tracker.js** - Main tracking library
2. **analytics/config.js** - Configuration (needs Google Script URL)
3. **analytics/ANALYTICS-README.md** - Complete setup guide

### Tracking Added to script.js:

✅ Page load
✅ Navigation tab clicks (Boss Timer, SF Calculator, Converter)
✅ Region switches (EU/NA)
✅ Theme toggle
✅ Notification toggle
✅ Export calendar
✅ Volume changes
✅ SF Calculator dungeon selection
✅ SF Calculator reset preset
✅ SF Calculator reset party  
✅ SF Calculator copy world chat
✅ Probability Converter add step
✅ Probability Converter reset all
✅ Promotional sidebar clicks

### Scripts Added to index.html:

✅ analytics/config.js
✅ analytics/tracker.js

---

## 📋 Next Steps (Follow ANALYTICS-README.md)

### Step 2: Set Up Google Sheet Tabs

Create 3 tabs in your sheet with headers:

**Tab 1: "Raw Events"**

- Timestamp | Date | Time | Category | Action | Label | User Agent | Screen Size | Language | Referrer

**Tab 2: "Daily Summary"**

- Add formulas to automatically calculate daily stats

**Tab 3: "Cumulative Stats"**

- Add formulas for all-time totals

### Step 3: Deploy Google Apps Script

1. Extensions → Apps Script
2. Paste the code from ANALYTICS-README.md
3. Deploy → New deployment → Web app
4. Execute as: Me
5. Who has access: Anyone
6. Copy the deployment URL

### Step 4: Update config.js

Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with your deployment URL

### Step 5: Test

1. Push to GitHub
2. Visit your site
3. Click around
4. Check "Raw Events" tab in Google Sheet

---

## 🎯 What Gets Tracked

| Category       | Action              | Label Examples                                       |
| -------------- | ------------------- | ---------------------------------------------------- |
| page           | page_load           | /bns-neo-boss-timer/                                 |
| navigation     | tab_click           | timer, sf-calculator, converter                      |
| navigation     | region_switch       | EU, NA                                               |
| header_control | theme_toggle        | light, dark                                          |
| header_control | notification_toggle | on, off                                              |
| header_control | export_calendar     | clicked                                              |
| header_control | volume_change       | 0-100                                                |
| sf_calculator  | dungeon_select      | Fire God, Desolate Tomb, etc.                        |
| sf_calculator  | reset_preset        | dungeon_name                                         |
| sf_calculator  | reset_party         | clicked                                              |
| sf_calculator  | copy_world_chat     | dungeon_name                                         |
| converter      | add_step            | total_steps_2, total_steps_3, etc.                   |
| converter      | reset_all           | had_3_steps, had_5_steps, etc.                       |
| promo          | promo_click         | SF Calculator, Probability Converter, Celestial Clan |

---

## 🔧 Configuration Options (config.js)

```javascript
enabled: true,              // Turn tracking on/off
rateLimitMs: 1000,         // Max 1 event per second
retryOnFail: true,         // Retry failed requests
queueOfflineEvents: true,   // Queue when offline
debug: false               // Console logging
```

---

## 📊 Sample Analytics Queries

Once you have data in "Raw Events", you can analyze:

**Most popular tool:**

```
=COUNTIF(F:F, "*SF Calculator*")
```

**Daily active users (approximate):**

```
=COUNTA(UNIQUE(FILTER(G:G, B:B=TODAY())))
```

**Peak hours:**

```
=MODE(HOUR(C:C))
```

---

## 🎉 You're Ready!

Follow the steps in **analytics/ANALYTICS-README.md** to complete setup.

All tracking code is already in place - you just need to:

1. Format your Google Sheet
2. Deploy the Apps Script
3. Update the URL in config.js
4. Push and test!
