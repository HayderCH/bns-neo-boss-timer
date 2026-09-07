# 🎁 Street Outfit Chest - Market News Feature Implementation Plan

## 📋 Overview

Add a new "Market News" tab featuring the Street Outfit Chest event with probability calculations, expected value analysis, break-even comparison, and market impact assessment with advice for both sellers and buyers.

---

## 🎯 Feature Components

### 1️⃣ New Promotional Box (Timer Page)

**Location:** Top of promotional boxes list (becomes box #1)

**Visual Elements:**

- **Icon:** Street Outfit Chest PNG
- **Title:** "💎 Convert Gems to Gold - Skip the Marketplace!"
- **Description:** "Turn 500 gems → ~26.62g instantly! Better than selling gold on marketplace (100g → only 1,840 gems after 8% fee). Direct conversion!"
- **Highlight:** "Get MORE gold per gem + avoid marketplace hassle!"
- **Button:** "💰 See Full Analysis" → Links to Market News tab
- **Date Badge:** "⏰ Jan 6 - Jan 20, 2026"
- **Styling:** Gold/gem themed colors, eye-catching border/glow effect, emphasis on efficiency numbers

---

### 2️⃣ New Tab: "Market News"

**Tab Navigation:**

- Position: After "Proba to Currency" tab
- Icon: 💎 (Diamond/Gem icon)
- Label: "Market News"

---

### 3️⃣ Market News Tab Content Structure

#### **Section A: Street Outfit Chest Overview**

**Layout:**

```
┌─────────────────────────────────────────────────────┐
│  [Chest Icon] Street Outfit Chest Event             │
│  Available: Jan 6 - Jan 20, 2026 | Unlimited Buys   │
│                                                      │
│  Cost: 500 [Divine Gem Icon] Divine Gems            │
└─────────────────────────────────────────────────────┘
```

**Drop Table:**

```
┌──────────────────────────────────────────────────────────────┐
│ What's Inside? (Click to expand previews ▼)                  │
├──────────────────────────────────────────────────────────────┤
│ [Hope Icon] Hope Outfit Chest                                │
│   • Probability: 90%                                         │
│   • Sell Price: 25g                                          │
│   • Customizable: ❌                                         │
├──────────────────────────────────────────────────────────────┤
│ [Final Showdown Icon] Final Showdown Outfit Chest           │
│   • Probability: 8%                                          │
│   • Sell Price: 26.5g                                        │
│   • Customizable: ❌                                         │
├──────────────────────────────────────────────────────────────┤
│ [Cargo Pants Icon] Cargo Pants Outfit Chest ⭐ RARE         │
│   • Probability: 2%                                          │
│   • Sell Price: 100g                                         │
│   • Customizable: ✅                                         │
└──────────────────────────────────────────────────────────────┘
```

**Preview Section (Collapsible - Hidden by Default):**

```
┌────────────────────────────────────────────────────────────────────────┐
│ 📸 Outfit Previews (Click to expand ▼)                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│ [Cargo Pants Preview Image]                                            │
│ 🎨 Cargo Pants                                                         │
│                                                                         │
│ Cargo Pants Preview features a modern, casual design built around      │
│ comfort and mobility. The outfit includes loose cargo-style pants      │
│ paired with fitted and oversized tops, creating a balanced look that   │
│ works naturally across all races: Lyn, Jin, Yun, and Gon.              │
│                                                                         │
│ The color palette uses muted earth tones, giving the outfit a clean    │
│ and grounded appearance that fits well in both urban and fantasy       │
│ environments. The relaxed fit allows animations and combat movements   │
│ to feel fluid without visual clutter.                                  │
│                                                                         │
│ This outfit is ideal for players who prefer a simple, practical style  │
│ that still looks coordinated and stylish in group settings.            │
│                                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│ [Final Showdown Preview Image]                                         │
│ ⚔️ Final Showdown                                                      │
│                                                                         │
│ Final Showdown Preview offers a sleek and compact design with a        │
│ sharper, more focused appearance. The outfit features fitted clothing  │
│ with light armor details and animal-themed accessories, creating a     │
│ distinct but balanced look across all races.                           │
│                                                                         │
│ The darker tones and refined textures give the outfit a serious,       │
│ battle-ready feel, while the streamlined shape highlights character    │
│ movement and stance during combat. Despite the animal elements, the    │
│ design remains neutral and adaptable, ensuring it does not favor any   │
│ single race.                                                            │
│                                                                         │
│ This outfit suits players looking for a clean, high-impact style that  │
│ stands out without being exaggerated.                                  │
│                                                                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                         │
│ [Hope Preview Image]                                                   │
│ ✨ Hope                                                                │
│                                                                         │
│ Hope Preview features a refined, formal design with strong Eastern-    │
│ inspired detailing. The outfit combines a fitted upper garment with    │
│ wide sleeves and clean decorative patterns, paired with slim trousers  │
│ and structured boots for a sharp, balanced silhouette.                 │
│                                                                         │
│ The red and gold color scheme gives the outfit a bold but controlled   │
│ presence, making it visually striking without being excessive.         │
│ Metallic accents and embroidered details add depth, while the tailored │
│ fit adapts well across all races — Lyn, Jin, Yun, and Gon —           │
│ maintaining proportion and clarity in both idle and combat animations. │
│                                                                         │
│ This outfit is suited for players who prefer an elegant, confident     │
│ look that blends tradition with a modern, battle-ready finish.         │
└────────────────────────────────────────────────────────────────────────┘
```

---

#### **Section B: Expected Value Calculator**

**Title:** "💰 Expected Returns Analysis"

**Calculation Display:**

```
┌─────────────────────────────────────────────────────────────┐
│ Average Gold Per Chest (Expected Value):                    │
│                                                              │
│ Calculation:                                                 │
│ (90% × 25g) + (8% × 26.5g) + (2% × 100g)                   │
│ = 22.5g + 2.12g + 2g                                        │
│ = 26.62g per chest                                          │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ Cost per chest: 500 Divine Gems                             │
│ Average return: 26.62g per chest                            │
│                                                              │
│ 📊 Quick Reference:                                         │
│ • 10 chests = 5,000 gems → ~266g                           │
│ • 50 chests = 25,000 gems → ~1,331g                        │
│ • 100 chests = 50,000 gems → ~2,662g                       │
└─────────────────────────────────────────────────────────────┘
```

---

#### **Section C: Market Impact Analysis**

**Title:** "📉 How This Impacts the Gold Market"

**Content:**

```
┌─────────────────────────────────────────────────────────────┐
│ Current Market Baseline (Before Event):                     │
│                                                              │
│ MARKETPLACE - Player-Set Prices (Current Average):          │
│                                                              │
│ 👤 Gold Sellers (Want Gems):                                │
│ • List 100g at their chosen price (currently ~2,000 gems)   │
│ • After 8% fee: Receive ~1,840 gems                         │
│ • Can adjust price based on demand/competition              │
│                                                              │
│ 👤 Gold Buyers (Want Gold):                                 │
│ • Pay whatever sellers list (currently ~2,000 gems/100g)    │
│ • Current cost: ~20 gems per 1g                             │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ Street Outfit Chest Economics:                              │
│ • Pay 500 gems → Get ~26.62g (sell outfit to NPC)          │
│ • Cost: 18.78 gems per 1g                                   │
│ • NO FEES on outfit sales to NPCs!                          │
│                                                              │
│ 📈 Chests are 6.1% CHEAPER than buying gold on marketplace! │
│ (18.78 gems/g vs 20 gems/g)                                 │
│ 💰 Best way to convert gems → gold!                         │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 🎯 Break-Even Analysis: Converting Gems → Gold              │
│                                                              │
│ Method 1: Street Outfit Chests (THIS EVENT!)                │
│ ✅ Pay 500 gems → Get 26.62g average                        │
│ ✅ Cost: 18.78 gems per 1g (FIXED - based on RNG)           │
│ ✅ No marketplace fees                                       │
│ ⚠️ Requires time to open & sell outfits to NPCs             │
│ ⚠️ Subject to RNG variance (gambling element)               │
│                                                              │
│ Method 2: Buy Gold from Marketplace                         │
│ ✅ Instant, guaranteed transaction                           │
│ ✅ No RNG, no time investment                                │
│ ❌ Cost: ~20 gems per 1g (VARIABLE - player-set prices)     │
│ ❌ Currently ~2,000 gems/100g (6.1% MORE expensive!)        │
│ 💡 May drop to ~1,700-1,800/100g if sellers compete         │
│                                                              │
│ 💡 Chests are better value unless marketplace drops below   │
│ ~1,878 gems/100g! Use marketplace only if you need gold     │
│ INSTANTLY and can't wait.                                    │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 💎 For Players with DIVINE GEMS (Want Gold):                │
│                                                              │
│ ✨ YOU BENEFIT FROM THIS EVENT! ✨                          │
│                                                              │
│ Best Strategy: Open Street Outfit Chests                    │
│ ✅ Pay 500 gems → Get 26.62g average                        │
│ ✅ Cost: 18.78 gems per gold (BEST RATE!)                   │
│ ✅ 6.1% cheaper than buying gold on marketplace             │
│ ⚠️ Takes time to open chests & sell to NPCs                │
│ ⚠️ RNG variance (but evens out over volume)                │
│                                                              │
│ Alternative: Buy Gold from Marketplace                       │
│ ✅ Instant, guaranteed transaction                           │
│ ✅ No RNG, no time investment                                │
│ ❌ Pay 2,000 gems for 100g (more expensive)                 │
│ ❌ 6.1% higher cost than chests                             │
│                                                              │
│ 💡 Recommendation: Open chests unless you need gold         │
│ INSTANTLY. Save 6.1% on every gold!                         │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 💰 For Players with GOLD (Want Divine Gems):                │
│                                                              │
│ ⚠️ THIS EVENT HURTS YOUR BUSINESS! ⚠️                       │
│                                                              │
│ Your Situation:                                              │
│ • You list 100g on marketplace (currently ~2,000 gems)       │
│ • After 8% fee: You receive ~1,840 gems                     │
│ • Buyers now have BETTER option (chests at 1,878 gems)     │
│ • Your marketplace listings will get less attention         │
│                                                              │
│ What You CAN'T Do:                                           │
│ ❌ Can't buy chests with gold (requires gems)               │
│ ❌ Can't match chest rate (math doesn't work)               │
│                                                              │
│ What You CAN Do:                                             │
│ 💡 Option 1: Lower your listing price                       │
│    • List at ~1,700-1,800 gems/100g to compete              │
│    • Accept lower profit for faster sales                   │
│ 💡 Option 2: Hold gold until after event (Jan 20+)          │
│    • Prices should return to ~2,000 gems/100g               │
│    • No profit loss, just patience required                 │
│ 💡 Option 3: Focus on other gem-earning methods             │
│                                                              │
│ 🔮 Good News: This is temporary! Market normalizes after!   │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 📊 Predicted Marketplace Impact:                            │
│                                                              │
│ For GOLD BUYERS (Have Gems, Want Gold):                     │
│ • Current marketplace: ~2,000 gems for 100g (player-set)    │
│ • Chest alternative: 1,878 gems for 100g (average)          │
│ • Expected: Buyers switch to chests (6.1% cheaper!)         │
│                                                              │
│ For GOLD SELLERS (Have Gold, Want Gems):                    │
│ • Current: List 100g for ~2,000 gems (receive 1,840)        │
│ • Impact: DEMAND DROPS (buyers prefer chests)               │
│ • Options:                                                   │
│   1. Lower listing price to compete (~1,800 gems/100g?)     │
│   2. Accept slower sales at current prices                  │
│   3. Hold gold until event ends (Jan 20+)                   │
│                                                              │
│ Timeline:                                                    │
│ Day 1-3 (NOW): Normal marketplace, ~2,000 gems/100g         │
│ Day 4-7: Demand drops, smart sellers lower to ~1,800        │
│ Day 8-14: Possible stabilization at ~1,700-1,800/100g       │
│ Day 15-20: Last-minute buyers return                        │
│ Post-Event (Jan 20+): Prices return to ~2,000/100g          │
│                                                              │
│ 🎯 Bottom Line:                                             │
│ Gem holders WIN (cheaper gold via chests)                   │
│ Gold sellers must ADAPT (lower prices or wait)              │
└─────────────────────────────────────────────────────────────┘
```

---

#### **Section D: Pro Tips & Strategies**

```
┌─────────────────────────────────────────────────────────────┐
│ 💡 Smart Player Strategies                                  │
│                                                              │
│ ✅ For GEM HOLDERS (Want Gold):                             │
│ 1. PRIMARY: Open chests! (18.78 gems per gold)              │
│ 2. Open in batches - RNG evens out over volume              │
│ 3. Sell outfits to NPCs immediately                          │
│ 4. Only buy marketplace gold if need INSTANT (6.1% premium) │
│                                                              │
│ ✅ For GOLD HOLDERS (Want Gems):                            │
│ 1. Assess: Can you wait until Jan 20+? (BEST option)        │
│ 2. If selling now: Consider lowering to ~1,700-1,800/100g   │
│ 3. Monitor marketplace - if others drop prices, adapt        │
│ 4. Don't panic - this event is temporary (14 days)          │
│                                                              │
│ ⚖️ Fair Trading Philosophy:                                 │
│ • Gem holders: This event is YOUR advantage - use it!       │
│ • Gold holders: Unlucky timing, demand will drop            │
│ • Chests = 6.1% cheaper gems→gold conversion                │
│ • Marketplace = instant but costs more for gem holders      │
│ • Event temporarily shifts market favor to gem holders      │
│                                                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                              │
│ 🎲 Risk vs Reward (Cargo Pants - 2% per chest):            │
│ • Opening 10 chests: 18.3% chance of Cargo Pants            │
│ • Opening 50 chests: 63.6% chance of Cargo Pants            │
│ • Opening 100 chests: 86.7% chance of Cargo Pants           │
│ • Even with bad RNG: 26.62g average is still 6.1% better!   │
│ • Marketplace gold: Guaranteed but costs 6.1% more          │
│                                                              │
│ 🔮 Long-Term Outlook:                                       │
│ Events like this temporarily increase gold circulation,      │
│ benefiting the overall economy. Both sellers and buyers     │
│ benefit when the market is competitive and fair!            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Design Principles

### Visual Hierarchy

1. **Large, clear headers** with emoji icons
2. **Distinct sections** separated by visual dividers
3. **Color coding:**
   - Green for profitable/positive info
   - Yellow/orange for warnings/important notes
   - Red for cautions
   - Purple/blue for rare items
   - Gold/gem colors for currency-related content

### Readability

- **Font sizes:** Headers (24px), subheaders (18px), body (14-16px)
- **Spacing:** Generous padding between sections
- **Contrast:** High contrast for important numbers
- **Icons:** Use throughout for visual anchoring

### Interactivity

- **Collapsible sections:** Preview images hidden by default
- **Hover effects:** On outfit cards and buttons
- **Smooth animations:** Expand/collapse transitions (300ms)
- **Responsive:** Mobile-friendly layout with breakpoints

---

## 🖼️ Required Assets

### Icons/Images Available (Already in `/assets/`):

1. ✅ **Street outfit chest.png** - Main chest icon
2. ✅ **Hope icon.png** - Hope outfit chest icon
3. ✅ **Hope preview.png** - Hope outfit full preview
4. ✅ **Final Showdown icon.png** - Final Showdown outfit icon
5. ✅ **Final Showdown preview.png** - Final Showdown full preview
6. ✅ **Cargo Pants icon.png** - Cargo Pants outfit icon
7. ✅ **Cargo Pants Preview.png** - Cargo Pants full preview
8. ✅ **divine gem.png** - Divine Gems currency icon

**All assets ready for implementation!**

---

## 📝 Implementation Files

### Files to Modify:

1. **index.html**

   - Add "Market News" tab button (after Probability to Currency)
   - Add Market News tab content container
   - Insert promotional box at TOP of promo-sidebar (first box)

2. **styles.css**

   - New styles for Market News tab layout
   - Promotional box featured styling (gold glow effect)
   - Outfit card styles with icons
   - Drop table styling
   - Collapsible preview styles
   - Expected value calculator display
   - Market analysis section styling
   - Responsive breakpoints for mobile

3. **script.js**
   - Tab switching logic for Market News
   - Collapsible preview toggle functionality
   - Promotional box click handler
   - Analytics tracking for:
     - Market News tab views
     - Promotional box clicks
     - Preview section expansions
     - Time spent on tab

---

## 📊 Analytics Tracking

Track these events in analytics:

- `promotional_box_click` - Street outfit chest promo clicked
- `market_news_tab_view` - Market News tab opened
- `outfit_preview_expand` - Preview section expanded
- `market_news_scroll` - User scrolled through analysis
- `market_news_time` - Time spent on tab

---

## ✅ Implementation Checklist

### Phase 1: HTML Structure ✓

- [ ] Add Market News tab button to navigation
- [ ] Create Market News tab content container
- [ ] Build outfit drop table with icons
- [ ] Add expected value calculator section
- [ ] Add market analysis content
- [ ] Add pro tips section
- [ ] Insert promotional box at top of promo-sidebar
- [ ] Add collapsible preview section with descriptions

### Phase 2: CSS Styling

- [ ] Style Market News tab layout (grid/flexbox)
- [ ] Create outfit card styles with hover effects
- [ ] Style drop table with icons
- [ ] Design expected value calculator display
- [ ] Style market impact section with dividers
- [ ] Add promotional box featured styling (gold theme, glow)
- [ ] Style collapsible preview section
- [ ] Implement responsive breakpoints (mobile, tablet, desktop)

### Phase 3: JavaScript Functionality

- [ ] Add Market News to tab switching logic
- [ ] Implement collapsible preview toggle
- [ ] Add promotional box click handler
- [ ] Update region-nav visibility logic (hide for Market News)
- [ ] Add analytics event tracking
- [ ] Test all interactions

### Phase 4: Testing

- [ ] Cross-browser testing (Chrome, Firefox, Edge, Safari)
- [ ] Mobile responsiveness (phones, tablets)
- [ ] Link functionality (promo box → Market News)
- [ ] Collapsible sections work properly
- [ ] Analytics verification
- [ ] Calculations accuracy check
- [ ] Image loading verification

---

## 🚀 Ready to Implement!

**Event Timeline:**

- Event runs: Jan 6 - Jan 20, 2026
- Today: Jan 7, 2026
- ⚠️ **URGENT: Deploy ASAP to maximize usefulness!**

**Key Features:**

- ✅ Clear break-even analysis showing when each method is best
- ✅ Advice for both sellers and buyers
- ✅ Realistic market predictions
- ✅ Eye-catching promotional box emphasizing gem-to-gold conversion
- ✅ Beautiful outfit previews with descriptions
- ✅ Professional UI/UX design

**All planning complete - Ready to code!** 🎯
