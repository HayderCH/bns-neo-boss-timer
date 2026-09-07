# Currency/Probability Converter - Development Roadmap

## 🎯 Goal

Create a versatile tool for BnS Neo players to calculate currency conversions and probability expectations, with support for complex chaining.

---

## 📋 Phase 1: Foundation (MVP)

**Target: Simple single-step conversions**

### Features:

- [ ] Navigation tab: "Currency/Probability"
- [ ] Tool message: "Powered by Brother Hajoon (Or Scamjoon?)"
- [ ] User guide (5 simple steps)
- [ ] Conversion type selector: Fixed Ratio / Probability
- [ ] Custom currency name inputs (X, Y, Z)

### Fixed Ratio Calculator:

- [ ] Input: Amount of Currency X
- [ ] Input: Exchange rate (X per Y)
- [ ] Output: How much Currency Y you get
- [ ] Bidirectional conversion (X→Y and Y→X)

### Probability Calculator:

- [ ] Input: Number of attempts/runs
- [ ] Input: Drop rate (%)
- [ ] Output: Expected average
- [ ] Output: Confidence intervals (50%, 63%, 90%, 99%)
- [ ] Output: "Runs needed for 1 drop" display

---

## 📋 Phase 2: Statistics & Polish

**Target: Better probability insights**

### Enhanced Probability Display:

- [ ] Visual probability curve/chart
- [ ] "Unlucky protection" calculator (pity system)
- [ ] Cost analysis (if runs cost currency)
- [ ] Expected value calculation

### UI Improvements:

- [ ] Dark theme consistency
- [ ] Responsive mobile layout
- [ ] Input validation with helpful errors
- [ ] Copy results button

---

## 📋 Phase 3: Multi-Step Chaining

**Target: Complex conversion chains**

### Chain Builder:

- [ ] Add/remove conversion steps
- [ ] Step types: Ratio, Probability, Combination
- [ ] Visual flow: Step 1 → Step 2 → Step 3
- [ ] Intermediate results display
- [ ] Final cumulative result

### Chain Features:

- [ ] Backward calculation (goal-seeking)
  - "I need 10 X, how much Y do I start with?"
- [ ] Branch support (multiple paths)
- [ ] Cost optimization suggestions

---

## 📋 Phase 4: Presets & Sharing

**Target: User convenience**

### Preset System:

- [ ] Save custom conversion chains
- [ ] Community presets (common BnS Neo farms)
- [ ] Import/export chains (JSON)
- [ ] URL sharing with encoded parameters

### Community Features:

- [ ] Popular conversion templates
- [ ] "Recently used" quick access
- [ ] Farming route recommendations

---

## 🎨 Design Notes

### Color Scheme:

- Fixed Ratio: Blue accent (reliable, direct)
- Probability: Orange/Yellow accent (RNG, uncertainty)
- Chained: Purple gradient (complex, multi-step)

### Key Formulas:

```javascript
// Probability for at least 1 success in n tries
P(X ≥ 1) = 1 - (1 - p)^n

// Runs needed for X% confidence
n = ln(1 - confidence) / ln(1 - dropRate)

// Examples:
// 63% confidence: n = ln(0.37) / ln(1-p)
// 90% confidence: n = ln(0.10) / ln(1-p)
```

### UX Principles:

1. Start simple (single conversion)
2. Progressive disclosure (advanced features hidden)
3. Show immediate results (no submit button)
4. Visual feedback (colors, animations)
5. Mobile-first design

---

## 📊 Success Metrics

- Users can calculate basic conversions in < 30 seconds
- Probability calculator provides actionable insights
- Chain builder enables complex scenarios without confusion
- Tool complements Boss Timer and SF Calculator seamlessly

---

## 🚀 Launch Plan

1. **Phase 1** → Test branch (basic converters working)
2. **Phase 2** → Dev branch (polish and statistics)
3. **Phase 3** → Test branch (chain system testing)
4. **Phase 4** → Main branch (full production)

---

_Last Updated: December 23, 2025_
_Contributors: Hayder (Kindle), Brother Hajoon_
