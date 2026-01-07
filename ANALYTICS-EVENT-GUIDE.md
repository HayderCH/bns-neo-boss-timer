# Market News Analytics Events Guide

## Events Being Tracked

### 1. **Market News Tab Navigation**

```javascript
Category: "navigation";
Action: "tab_click";
Label: "market-news";
```

**Triggered when:** User clicks the "💎 Market News" tab button

---

### 2. **Promotional Box Click**

```javascript
Category: "promotion";
Action: "promo_box_click";
Label: "street_outfit_chest";
```

**Triggered when:** User clicks anywhere on the gold promotional box in the sidebar

---

### 3. **Preview Expand**

```javascript
Category: "market_news";
Action: "preview_expand";
Label: "outfit_previews";
```

**Triggered when:** User clicks "🔽 Show Full Outfit Previews" button

---

### 4. **Preview Collapse**

```javascript
Category: "market_news";
Action: "preview_collapse";
Label: "outfit_previews";
```

**Triggered when:** User clicks "🔼 Hide Outfit Previews" button

---

## How to View Events in Google Sheets

### Expected Data in "Raw Events" Sheet:

| Column | Field        | Example Value                                                              |
| ------ | ------------ | -------------------------------------------------------------------------- |
| A      | Timestamp    | 2026-01-07T14:23:45.123Z                                                   |
| B      | Date         | 2026-01-07                                                                 |
| C      | Time         | 14:23:45                                                                   |
| D      | **Category** | `promotion` or `market_news` or `navigation`                               |
| E      | **Action**   | `promo_box_click` or `preview_expand` or `preview_collapse` or `tab_click` |
| F      | **Label**    | `street_outfit_chest` or `outfit_previews` or `market-news`                |
| G      | User Agent   | Mozilla/5.0...                                                             |
| H      | Screen Size  | 1920x1080                                                                  |
| I      | Language     | en-US                                                                      |
| J      | Referrer     | direct or URL                                                              |

---

## Filter Events in Excel/Google Sheets

### To see ONLY promotional box clicks:

```
Filter Column D (Category) = "promotion"
Filter Column E (Action) = "promo_box_click"
```

### To see ONLY Market News interactions:

```
Filter Column D (Category) = "market_news"
```

### To see ALL Market News related events (including navigation):

```
Filter Column D (Category) = "market_news" OR "navigation"
Filter Column F (Label) = "market-news" OR "outfit_previews"
```

---

## Testing Events Manually

### Open Browser Console (F12) and run:

```javascript
// 1. Test promotional box click
analytics.track("promotion", "promo_box_click", "street_outfit_chest");

// 2. Test Market News tab click
analytics.track("navigation", "tab_click", "market-news");

// 3. Test preview expand
analytics.track("market_news", "preview_expand", "outfit_previews");

// 4. Test preview collapse
analytics.track("market_news", "preview_collapse", "outfit_previews");
```

---

## Checking if Analytics is Working

1. Open browser console (F12)
2. Click on promotional box or Market News elements
3. Look for console messages like:

   ```
   [Analytics] Tracking event: {category: "promotion", action: "promo_box_click", ...}
   [Analytics] Event sent successfully
   ```

4. Check your Google Sheet's "Raw Events" tab for new rows

---

## Important Notes

- **Rate Limiting:** Events are rate-limited to prevent spam (default: 500ms between events)
- **Offline Queue:** Events are queued when offline and sent when connection restored
- **No-CORS Mode:** Responses from Google Apps Script can't be read due to CORS, but events are still logged
- **Debug Mode:** Set `debug: true` in `analytics/config.js` to see detailed logs

---

## Troubleshooting

### Events not appearing in sheet?

1. **Check if analytics is enabled:**

   - Open `analytics/config.js`
   - Ensure `enabled: true`

2. **Check if script URL is configured:**

   - Open `analytics/config.js`
   - Ensure `scriptUrl` is NOT "YOUR_GOOGLE_SCRIPT_URL_HERE"

3. **Check if event type is enabled:**

   - Open `analytics/config.js`
   - Ensure relevant event types are `true`:
     ```javascript
     events: {
       navigation: true,
       promotion: true,
       market_news: true,
     }
     ```

4. **Check browser console for errors:**

   - Press F12
   - Look for red error messages
   - Look for "[Analytics]" log messages

5. **Verify Google Apps Script deployment:**
   - Script must be deployed as Web App
   - Execute as: "Me"
   - Who has access: "Anyone"

---

## Quick Stats Queries

### Count promotional box clicks:

```sql
=COUNTIFS(D:D,"promotion",E:E,"promo_box_click")
```

### Count Market News tab visits:

```sql
=COUNTIFS(D:D,"navigation",F:F,"market-news")
```

### Count preview expansions:

```sql
=COUNTIFS(D:D,"market_news",E:E,"preview_expand")
```

### Get unique users who clicked promo box:

```sql
=UNIQUE(FILTER(G:G, D:D="promotion", E:E="promo_box_click"))
```

---

## Event Flow Example

### User Journey:

1. User loads page → `page_load` event
2. User sees promotional box and clicks → `promo_box_click` event
3. Page navigates to Market News → `tab_click` event with label "market-news"
4. User clicks "Show Previews" → `preview_expand` event
5. User clicks "Hide Previews" → `preview_collapse` event

### Expected Google Sheets Entries:

```
Row 1: promotion | promo_box_click | street_outfit_chest
Row 2: navigation | tab_click | market-news
Row 3: market_news | preview_expand | outfit_previews
Row 4: market_news | preview_collapse | outfit_previews
```
