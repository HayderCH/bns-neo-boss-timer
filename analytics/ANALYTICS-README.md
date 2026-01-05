# 📊 Analytics Setup Guide

## ✅ Step 1: Create Google Sheet - DONE

Your sheet: https://docs.google.com/spreadsheets/d/17xnnb4F8cdhZb424a03sQ8LaROwEJHCa3nKRW_t05QY/edit

---

## 📝 Step 2: Set Up Tabs in Your Sheet

Create 3 tabs (sheets) in your Google Spreadsheet:

### Tab 1: "Raw Events"

Add these column headers in row 1:

```
A: Timestamp | B: Date | C: Time | D: Category | E: Action | F: Label | G: User Agent | H: Screen Size | I: Language | J: Referrer
```

### Tab 2: "Daily Summary"

Add these headers and formulas:

**Row 1 (Headers):**

```
A: Date | B: Total Events | C: Tab Clicks | D: SF Calculator | E: Converter | F: Boss Timer Active | G: Unique Sessions
```

**Row 2 (Formulas for today):**

- A2: `=TEXT(TODAY(), "yyyy-MM-dd")`
- B2: `=COUNTIF('Raw Events'!B:B, A2)`
- C2: `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "navigation")`
- D2: `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "sf_calculator") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*sf-calculator*")`
- E2: `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "converter") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*converter*")`
- F2: `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "boss_timer") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*timer*")`
- G2: `=COUNTA(UNIQUE(FILTER('Raw Events'!G2:G, 'Raw Events'!B2:B=A2)))`

Copy row 2 down for historical dates (change A3 to yesterday, A4 to day before, etc.)

### Tab 3: "Cumulative Stats"

Add these headers and formulas:

**Column A (Metrics):**

```
A1: Metric
A2: Total Events
A3: Most Popular Tool
A4: Most Used Dungeon
A5: Most Common Screen Size
A6: Total Tab Clicks
A7: Total Button Clicks
A8: Average Events per Day
```

**Column B (Values):**

```
B1: Value
B2: =COUNTA('Raw Events'!A:A)-1
B3: =IFERROR(INDEX('Raw Events'!F2:F, MODE(MATCH('Raw Events'!F2:F, 'Raw Events'!F2:F, 0))), "Not enough data")
B4: =IFERROR(INDEX(FILTER('Raw Events'!F2:F, 'Raw Events'!E2:E="dungeon_select"), MODE(MATCH(FILTER('Raw Events'!F2:F, 'Raw Events'!E2:E="dungeon_select"), FILTER('Raw Events'!F2:F, 'Raw Events'!E2:E="dungeon_select"), 0))), "No dungeons selected yet")
B5: =IFERROR(INDEX('Raw Events'!H2:H, MODE(MATCH('Raw Events'!H2:H, 'Raw Events'!H2:H, 0))), "Not enough data")
B6: =COUNTIF('Raw Events'!D:D, "navigation")
B7: =COUNTIF('Raw Events'!E:E, "*_click")
B8: =IF(COUNTA(UNIQUE('Raw Events'!B2:B))>0, B2/COUNTA(UNIQUE('Raw Events'!B2:B)), 0)
```

---

## 🔧 Step 3: Create Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any default code
3. **Paste this code:**

```javascript
// ============================================
// BNS Timer Analytics - Google Apps Script
// Receives analytics events and logs to sheet
// ============================================

function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);

    // Get the "Raw Events" sheet
    const sheet =
      SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Raw Events");

    if (!sheet) {
      return ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          error: 'Sheet "Raw Events" not found',
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // Extract timestamp parts
    const timestamp = new Date(data.timestamp);
    const date = Utilities.formatDate(timestamp, "GMT", "yyyy-MM-dd");
    const time = Utilities.formatDate(timestamp, "GMT", "HH:mm:ss");

    // Append row to sheet
    sheet.appendRow([
      data.timestamp, // A: Timestamp
      date, // B: Date
      time, // C: Time
      data.category || "", // D: Category
      data.action || "", // E: Action
      data.label || "", // F: Label
      data.userAgent || "", // G: User Agent
      data.screenSize || "", // H: Screen Size
      data.language || "", // I: Language
      data.referrer || "", // J: Referrer
    ]);

    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({
        success: true,
        message: "Event logged",
      })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return error
    return ContentService.createTextOutput(
      JSON.stringify({
        success: false,
        error: error.toString(),
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function (optional - for debugging)
function testPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        timestamp: new Date().toISOString(),
        category: "test",
        action: "test_action",
        label: "Test Event",
        userAgent: "Test Browser",
        screenSize: "1920x1080",
        language: "en-US",
        referrer: "https://test.com",
      }),
    },
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}

// ============================================
// Auto-create Daily Summary rows
// ============================================

// This function runs daily to create a new row for today
function createDailySummaryRow() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dailySummary = ss.getSheetByName("Daily Summary");

  if (!dailySummary) {
    Logger.log("Daily Summary sheet not found");
    return;
  }

  const today = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd");
  const lastRow = dailySummary.getLastRow();

  // Check if today's row already exists (check row 2, which is the most recent)
  if (lastRow > 1) {
    const topDate = dailySummary.getRange(2, 1).getValue();
    // Format the date properly for comparison
    const topDateStr = topDate
      ? Utilities.formatDate(new Date(topDate), "GMT", "yyyy-MM-dd")
      : "";
    if (topDateStr === today) {
      Logger.log("Today's row already exists");
      return;
    }
  }

  // Insert new row at position 2 (right after header)
  dailySummary.insertRowBefore(2);

  // Add formulas for the new row
  const formulas = [
    `=TEXT(TODAY(), "yyyy-MM-dd")`,
    `=COUNTIF('Raw Events'!B:B, A2)`,
    `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "navigation")`,
    `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "sf_calculator") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*sf-calculator*")`,
    `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "converter") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*converter*")`,
    `=COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!D:D, "boss_timer") + COUNTIFS('Raw Events'!B:B, A2, 'Raw Events'!F:F, "*timer*")`,
    `=COUNTA(UNIQUE(FILTER('Raw Events'!G2:G, 'Raw Events'!B2:B=A2)))`,
  ];

  // Set formulas in the new row
  for (let i = 0; i < formulas.length; i++) {
    dailySummary.getRange(2, i + 1).setFormula(formulas[i]);
  }

  Logger.log("Created new row for " + today);
}
```

4. **Set up automatic daily trigger:**

   - In Apps Script editor, click the **clock icon** ⏰ (Triggers) on the left sidebar
   - Click **+ Add Trigger** (bottom right)
   - Configure:
     - Function: `createDailySummaryRow`
     - Deployment: Head
     - Event source: Time-driven
     - Type: Day timer
     - Time of day: 12am to 1am (or your preferred time)
   - Click **Save**
   - You may need to authorize the trigger

5. **Manual first-time setup:**

   - Run `createDailySummaryRow` once manually to create today's row
   - Click the play button ▶️ next to the function name
   - After that, it runs automatically every day!

6. Click **Deploy → New deployment**
7. Click the gear icon ⚙️ next to "Select type" → Choose **Web app**
8. Configure:
   - **Description:** BNS Timer Analytics
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
9. Click **Deploy**
10. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)
11. Paste it in `config.js` (next step)

---

## 🔐 Step 4: Update config.js

Open `analytics/config.js` and replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with the URL you just copied.

---

## 🧪 Step 5: Test the Setup

1. Save all files and push to GitHub
2. Wait for GitHub Pages to deploy
3. Visit your site and click around
4. Check your Google Sheet "Raw Events" tab - you should see data appearing!

---

## 📊 What Gets Tracked

### Navigation Events

- ✅ Tab clicks (Boss Timer, SF Calculator, Converter)
- ✅ Region switches (EU/NA)

### Boss Timer

- ✅ Boss card expand/collapse
- ✅ Spreadsheet link clicks

### SF Calculator

- ✅ Dungeon selection
- ✅ Party member add/remove
- ✅ Copy world chat
- ✅ Reset actions
- ✅ Preset reset

### Probability Converter

- ✅ Converter type switch
- ✅ Add conversion step
- ✅ Reset converter

### Header Controls

- ✅ Theme toggle
- ✅ Notification toggle
- ✅ Export calendar
- ✅ Volume changes

### Promotional Sidebar

- ✅ Promo box clicks

---

## 🔒 Privacy & Security

**Privacy-Friendly:**

- ✅ No cookies used
- ✅ No personal data collected
- ✅ No IP addresses logged
- ✅ User Agent is logged (for device stats only)
- ✅ Data stays in your private Google Sheet

**Security:**

- ⚠️ The script URL is public (anyone can send data)
- ✅ Mitigated by keeping sheet private (only you can view)
- ✅ Rate limiting in tracker (max 1 event per second per user)

---

## 📈 Analyzing Your Data

### View Daily Summary

- Go to "Daily Summary" tab
- See today's stats automatically calculated
- Add rows for historical dates

### View Cumulative Stats

- Go to "Cumulative Stats" tab
- See all-time totals and most popular features

### Export Data

- File → Download → CSV (for "Raw Events")
- Analyze in Excel, Python, or any tool you prefer

---

## 🐛 Troubleshooting

**No data appearing?**

1. Check browser console for errors (F12)
2. Verify the script URL in `config.js` is correct
3. Make sure you deployed the Apps Script as "Anyone" access
4. Check if the "Raw Events" sheet exists with correct headers

**Too much spam data?**

1. Analytics is working! But might be getting bot traffic
2. Filter by User Agent in the sheet
3. Add IP filtering in Apps Script (requires more setup)

**Want to disable tracking temporarily?**

1. Open `config.js`
2. Set `enabled: false`
3. Tracking will stop without breaking the site

---

## 💡 Tips

- **Check stats daily** to understand user behavior
- **Look for patterns** - which tools are most popular?
- **Use data to improve** - if nobody uses a feature, consider removing it
- **Share insights** with your community (without revealing personal data)

---

## Status: Ready to Deploy! 🚀

All files created. Follow steps 2-5 above to complete setup.
