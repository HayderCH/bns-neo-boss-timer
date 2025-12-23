# Feature: Multi-Tool Navigation System

## Overview

Transform the single-purpose Boss Timer into a multi-tool BnS Neo utility suite with tab-based navigation. Single-page app (SPA) architecture for seamless switching between tools.

---

## Phase 1: Navigation Infrastructure 🚀

### 1.1 Nav Bar Implementation

- [ ] Create responsive navigation bar component
- [ ] Add tool icons/labels for each feature
- [ ] Implement active state highlighting
- [ ] Mobile-responsive hamburger menu
- [ ] Smooth transitions between views

### 1.2 View Management System

- [ ] Create view container structure
- [ ] Implement show/hide logic for each tool view
- [ ] Add route/hash navigation (`#timer`, `#sf-calculator`)
- [ ] Preserve state when switching views
- [ ] Default to Boss Timer on page load

### 1.3 Styling & UX

- [ ] Consistent header across all tools
- [ ] Match existing dark theme aesthetics
- [ ] Smooth fade transitions between views
- [ ] Loading states (if needed)
- [ ] Accessibility (keyboard navigation, ARIA labels)

---

## Phase 2: Supreme Force Calculator Tool 📊

### 2.1 Dungeon Preset System

**Purpose:** Pre-configured SF requirements for each dungeon's challenge mode with local override flexibility

**Data Structure:**

```javascript
const DUNGEON_PRESETS = {
  "Blood Shark Harbor CM": { minSF: 3000, maxAvg: 3500 },
  "Midnight Skypetal Plains CM": { minSF: 3200, maxAvg: 3700 },
  "Celestial Basin CM": { minSF: 3400, maxAvg: 3900 },
  // Admin-controlled values in code (updated with patches)
};
```

**Implementation:**

- [ ] Create JSON/JS object with dungeon configurations
- [ ] Dropdown selector for dungeon name (includes "None - Manual Entry" option)
- [ ] Auto-populate MIN_SF and MAX_AVG when dungeon selected
- [ ] **Editable inputs**: User can modify values locally after selection
- [ ] Manual mode: No dungeon selected, user enters both values freely
- [ ] Local changes don't affect hardcoded presets (session-only)
- [ ] Input validation for all SF values (numeric, reasonable ranges)

**Use Cases:**

- ✅ **Quick start**: Select dungeon → use preset values
- ✅ **Patch adjustments**: Select dungeon → modify values if patch changed them
- ✅ **Manual entry**: Don't select dungeon → enter values freely
- ✅ **Testing**: Override any values for "what-if" scenarios

**Security:**

- ✅ Presets hardcoded in source code (not permanently editable)
- ✅ User modifications are client-side only (session scope)
- ✅ All inputs validated and sanitized
- ✅ No data persistence to backend/server

### 2.2 Core Calculator Logic

**Constraints:**

- Max party average SF: `MAX_AVG` (from dungeon preset or custom)
- Min individual SF: `MIN_SF` (from dungeon preset or custom)
- Party size: 6 players

**Math:**

```
Given: filled slots with SF values [s₁, s₂, ..., sₙ]
Sum of filled: Σ = s₁ + s₂ + ... + sₙ
Remaining slots: r = 6 - n
Max sum allowed: MAX_SUM = MAX_AVG × 6
Remaining budget: BUDGET = MAX_SUM - Σ
Max per remaining slot: MAX_SLOT = BUDGET / r
Valid range for next recruit: [MIN_SF, MAX_SLOT]
```

### 2.3 UI Components

**Dungeon Selection:**

- [ ] Dropdown: Select dungeon (preset list + "None - Manual Entry" option)
- [ ] Input fields: MIN_SF and MAX_AVG (editable, pre-filled if dungeon selected)
- [ ] Behavior:
  - Select dungeon → values auto-populate → user can modify
  - Select "None" → empty fields → user enters values manually
- [ ] "Reset to Preset" button (appears when dungeon selected and values modified)

**Party Builder:**

- [ ] Input: Your SF (player 1 - initiating recruitment)
- [ ] 5 optional slots for recruited members (players 2-6)
- [ ] Real-time range display for each unfilled slot
- [ ] "Clear" button for each filled slot
- [ ] "Reset Party" button (clears party, keeps dungeon selection & SF requirements)
- [ ] Visual feedback: 🟢 Safe / 🟡 Tight / 🔴 Over budget

### 2.4 Display Features

- [ ] Show selected dungeon name (if any)
- [ ] Show current MIN_SF and MAX_AVG in use (editable fields)
- [ ] Indicator if values were modified from preset
- [ ] Show current party average SF
- [ ] Show remaining "budget" points
- [ ] Highlight valid range dynamically for next recruit
- [ ] Warning if impossible to fill (over budget)
- [ ] Success indicator when party complete & valid

### 2.5 Advanced Features (Optional)

- [ ] "What-if" scenarios without committing
- [ ] Export/share party composition
- [ ] Recommendation engine ("recruit ~X SF for balanced party")
- [ ] Save favorite party compositions (localStorage)
- [ ] Dungeon search/filter in dropdown

---

## Phase 3: Probability Calculator Tool 🎲

_(Future Implementation)_

### 3.1 Potential Features

- [ ] Drop rate calculations
- [ ] Breakthrough success probability
- [ ] Awakening attempt optimizer
- [ ] Material farming efficiency
- [ ] RNG pity system tracker

### 3.2 Integration

- [ ] Add to navigation menu
- [ ] Create dedicated view
- [ ] Implement calculator logic
- [ ] Add tool-specific styling

---

## Phase 4: Additional Tools (Backlog) 🔮

### Ideas for Future Tools:

- **Build Optimizer**: Calculate optimal gear/stats
- **DPS Calculator**: Estimate damage output
- **Material Tracker**: Track farming progress
- **Event Countdown**: Track limited-time events
- **Daily/Weekly Checklist**: Track completions

---

## Technical Implementation Plan

### File Structure

```
index.html          → Main SPA with all tools
script.js           → Split into modules:
  ├── timer.js      → Boss timer logic (existing)
  ├── navigation.js → View switching & routing
  ├── sf-calc.js    → SF Calculator logic
  ├── dungeons.js   → Dungeon preset configurations
  └── utils.js      → Shared utilities
styles.css          → Tool-specific sections
```

### Dungeon Preset Data

```javascript
// dungeons.js - Admin-controlled dungeon configurations
const DUNGEON_PRESETS = [
  {
    id: "bsh-cm",
    name: "Blood Shark Harbor CM",
    minSF: 3000,
    maxAvg: 3500,
    recommended: 3250,
  },
  {
    id: "msp-cm",
    name: "Midnight Skypetal Plains CM",
    minSF: 3200,
    maxAvg: 3700,
    recommended: 3450,
  },
  {
    id: "cb-cm",
    name: "Celestial Basin CM",
    minSF: 3400,
    maxAvg: 3900,
    recommended: 3650,
  },
  // More dungeons added by admin here...
];

// Custom mode option
const CUSTOM_PRESET = {
  id: "custom",
  name: "Custom (Manual Input)",
  minSF: null,
  maxAvg: null,
};
```

### Code Architecture

```javascript
// Navigation system
const Tools = {
  TIMER: "timer",
  SF_CALCULATOR: "sf-calculator",
  PROBABILITY: "probability",
};

function showTool(toolName) {
  // Hide all views
  // Show selected view
  // Update nav state
  // Update URL hash
}

// Dungeon Management
class DungeonManager {
  constructor() {
    this.presets = DUNGEON_PRESETS;
    this.currentDungeon = null;
    this.currentMinSF = null;
    this.currentMaxAvg = null;
  }

  selectDungeon(dungeonId) {
    if (dungeonId === "none") {
      this.currentDungeon = null;
      this.currentMinSF = null;
      this.currentMaxAvg = null;
      return null;
    }

    this.currentDungeon = this.presets.find((d) => d.id === dungeonId);
    if (this.currentDungeon) {
      // Populate values from preset (user can modify after)
      this.currentMinSF = this.currentDungeon.minSF;
      this.currentMaxAvg = this.currentDungeon.maxAvg;
    }
    return this.currentDungeon;
  }

  setMinSF(value) {
    const sanitized = sanitizeSFInput(value);
    if (sanitized !== null) {
      this.currentMinSF = sanitized;
      return true;
    }
    return false;
  }

  setMaxAvg(value) {
    const sanitized = sanitizeSFInput(value);
    if (sanitized !== null) {
      this.currentMaxAvg = sanitized;
      return true;
    }
    return false;
  }

  resetToPreset() {
    // Reset to original preset values
    if (this.currentDungeon) {
      this.currentMinSF = this.currentDungeon.minSF;
      this.currentMaxAvg = this.currentDungeon.maxAvg;
    }
  }

  getCurrentRequirements() {
    return {
      minSF: this.currentMinSF,
      maxAvg: this.currentMaxAvg,
      isModified:
        this.currentDungeon &&
        (this.currentMinSF !== this.currentDungeon.minSF ||
          this.currentMaxAvg !== this.currentDungeon.maxAvg),
    };
  }
}

// SF Calculator
class SFCalculator {
  constructor(dungeonManager) {
    this.dungeonManager = dungeonManager;
    this.party = Array(6).fill(null);
  }

  updateRequirements() {
    // Get current requirements (may be from preset or manual entry)
    const reqs = this.dungeonManager.getCurrentRequirements();
    this.minSF = reqs.minSF;
    this.maxAvg = reqs.maxAvg;
  }

  setMember(index, sfValue) {
    // Validate: sfValue must be a number
    if (!Number.isInteger(sfValue) || sfValue < 0) return false;

    // Update party composition
    this.party[index] = sfValue;

    // Recalculate valid ranges
    return this.getValidRange();
  }

  getValidRange() {
    // Calculator needs valid requirements first
    if (this.minSF === null || this.maxAvg === null) {
      return { status: "no-requirements" };
    }

    // Calculate [MIN_SF, MAX_SLOT] for next recruit
    const filled = this.party.filter((sf) => sf !== null);
    const sum = filled.reduce((a, b) => a + b, 0);
    const remaining = 6 - filled.length;

    if (remaining === 0) return { status: "full" }; // Party full

    const maxSum = this.maxAvg * 6;
    const budget = maxSum - sum;
    const maxSlot = budget / remaining;

    return {
      min: this.minSF,
      max: Math.floor(maxSlot),
      budget: budget,
      remaining: remaining,
      status: maxSlot >= this.minSF ? "valid" : "impossible",
    };
  }

  getCurrentAverage() {
    const filled = this.party.filter((sf) => sf !== null);
    if (filled.length === 0) return 0;
    return (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(0);
  }

  reset() {
    this.party = Array(6).fill(null);
  }
}
```

getValidRange() {
// Calculate [MIN_SF, MAX_SLOT] for next recruit
}
}

````

### Security Considerations

✅ **All client-side** → No backend vulnerabilities
✅ **Dungeon presets hardcoded** → Original values protected, only local session modifications allowed
✅ **Input validation** → All SF inputs validated (MIN_SF, MAX_AVG, party slots)
✅ **XSS prevention** → Use `textContent` for display, validate all inputs
✅ **Dropdown-based selection** → Presets loaded from hardcoded source
✅ **Session-only modifications** → No permanent changes to preset data
✅ **No sensitive data storage** → No cookies/localStorage for SF values
✅ **HTTPS by default** → GitHub Pages standard

**Input Sanitization:**
```javascript
function sanitizeSFInput(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || parsed > 999999) {
    return null; // Invalid
  }
  return parsed;
}

// Additional validation for requirements
function validateRequirements(minSF, maxAvg) {
  if (minSF === null || maxAvg === null) return false;
  if (minSF > maxAvg) return false; // Min can't exceed max
  if (minSF < 0 || maxAvg < 0) return false;
  return true;
}
````

---

## Rollout Strategy

### Milestone 1: Navigation Framework

- Implement nav bar
- Create view switching
- Migrate existing timer to new structure
- Test on all devices

### Milestone 2: SF Calculator MVP

- Build dungeon preset system (dropdown + data)
- Implement basic calculator logic
- Create UI with dungeon selector + 6 party slots
- Add real-time range updates
- Input validation & security
- Deploy & test

### Milestone 3: Polish & Expand

- Add preset configurations
- Improve mobile experience
- Add probability calculator
- Community feedback iteration

---

## Testing Checklist

### Navigation

- [ ] All tools accessible from nav
- [ ] Back button works (URL hash navigation)
- [ ] Mobile menu functions properly
- [ ] Active state reflects current tool

### SF Calculator

- [ ] Dungeon dropdown populated correctly (includes "None - Manual Entry")
- [ ] Preset values applied when dungeon selected
- [ ] User can modify MIN_SF and MAX_AVG after selection
- [ ] "Reset to Preset" button works correctly
- [ ] Manual mode: both fields empty until user inputs
- [ ] Validation: MIN_SF < MAX_AVG enforced
- [ ] Math calculations correct for all scenarios
- [ ] Range updates in real-time as slots filled
- [ ] Invalid inputs rejected gracefully (non-numeric, negative, etc.)
- [ ] Edge cases handled (all slots filled, over budget, impossible ranges)
- [ ] Clear/reset party functions work
- [ ] Display shows current average, budget, status correctly
- [ ] Modified indicator shows when values differ from preset

### Cross-Tool

- [ ] State preserved when switching
- [ ] No memory leaks
- [ ] Performance smooth on mobile
- [ ] PWA still functions (offline, install, etc.)

---

## Design Mockup (Text)

```
╔═══════════════════════════════════════════════════════════╗
║  BnS Neo Tools               [🕐 Timer] [📊 SF Calc] [🎲] ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ━━━ SUPREME FORCE PARTY CALCULATOR ━━━                   ║
║                                                           ║
║  Dungeon: [Blood Shark Harbor CM ▼]                      ║
║                                                           ║
║  Requirements (Editable):                                 ║
║    Min Individual SF: [3000] [Reset to Preset]           ║
║    Max Party Average:  [3500]                            ║
║    ℹ️  Values modified from preset                        ║
║                                                           ║
║  ┌─── Party Composition ───────────────────────────────┐ ║
║  │ Slot 1 (You):  [3250] ✓                             │ ║
║  │ Slot 2:        [3400] ✓  [Clear]                    │ ║
║  │ Slot 3:        [____]    Recruit: 3000-3525 🟢      │ ║
║  │ Slot 4:        [____]    Recruit: 3000-3525 🟢      │ ║
║  │ Slot 5:        [____]    Recruit: 3000-3525 🟢      │ ║
║  │ Slot 6:        [____]    Recruit: 3000-3525 🟢      │ ║
║  └──────────────────────────────────────────────────────┘ ║
║                                                           ║
║  📊 Current Average: 3325 SF                              ║
║  💰 Budget Remaining: 8400 SF for 4 slots                 ║
║  ✅ Status: Party is Valid                                ║
║                                                           ║
║  [Reset Party]                                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

MANUAL MODE:
╔═══════════════════════════════════════════════════════════╗
║  Dungeon: [None - Manual Entry ▼]                        ║
║                                                           ║
║  Requirements:                                            ║
║    Min Individual SF: [____]  Enter manually             ║
║    Max Party Average:  [____]  Enter manually            ║
║                                                           ║
║  [Enter requirements to start party builder]              ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Success Metrics

- ✅ Seamless navigation between tools
- ✅ SF Calculator provides accurate ranges
- ✅ Mobile-friendly responsive design
- ✅ No performance degradation
- ✅ Community adoption & feedback
- ✅ Foundation for rapid tool expansion

---

## Notes

- **Keep Boss Timer as primary** (most popular feature)
- **Progressive enhancement** (tools work independently)
- **Consistent UX** across all tools
- **Modular code** for easy addition of new tools
- **No external dependencies** (keep it lightweight)

---

## Timeline Estimate

- **Phase 1 (Navigation)**: 1-2 days
- **Phase 2 (SF Calculator)**: 2-3 days
- **Phase 3 (Probability Calc)**: TBD
- **Total for Phases 1-2**: ~1 week

---

_Last Updated: December 23, 2025_
