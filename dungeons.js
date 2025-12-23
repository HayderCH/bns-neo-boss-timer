/**
 * Dungeon Challenge Mode SF Requirements
 *
 * These are hardcoded preset values that can be updated by admins.
 * Users can select dungeons from dropdown and modify values locally (session-only).
 */

const DUNGEON_PRESETS = [
  {
    id: "sundered-nexus-upper",
    name: "Sundered Nexus: Upper Floor",
    minSF: 11690,
    maxAvg: 14690,
    recommended: 13190,
  },
  {
    id: "sundered-nexus-lower",
    name: "Sundered Nexus: Lower Floor",
    minSF: 11690,
    maxAvg: 14690,
    recommended: 13190,
  },
  {
    id: "frenzy-avalanche-den",
    name: "Frenzy Avalanche Den",
    minSF: 14930,
    maxAvg: 17830,
    recommended: 16380,
  },
  {
    id: "queens-altar",
    name: "Queen's Altar",
    minSF: 20970,
    maxAvg: 23970,
    recommended: 22470,
  },
  {
    id: "soguns-lament-interior",
    name: "Sogun's Lament: Interior",
    minSF: 8890,
    maxAvg: 11890,
    recommended: 10390,
  },
  {
    id: "soguns-lament-gardens",
    name: "Sogun's Lament: Gardens",
    minSF: 7710,
    maxAvg: 10710,
    recommended: 9210,
  },
  {
    id: "talus-dungeon",
    name: "Talus Dungeon",
    minSF: 6820,
    maxAvg: 8020,
    recommended: 7420,
  },
  {
    id: "ebondrake-hideout",
    name: "Ebondrake Hideout",
    minSF: 6110,
    maxAvg: 7110,
    recommended: 6610,
  },
  {
    id: "chunka-frost-cavern",
    name: "Chunka Frost Cavern",
    minSF: 5370,
    maxAvg: 6370,
    recommended: 5870,
  },
  {
    id: "skybreak-spire",
    name: "Skybreak Spire",
    minSF: 0,
    maxAvg: 0,
    recommended: 0,
    note: "Requirements not yet known - enter manually",
  },
];

// Manual entry option
const MANUAL_ENTRY = {
  id: "manual",
  name: "None - Manual Entry",
  minSF: null,
  maxAvg: null,
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { DUNGEON_PRESETS, MANUAL_ENTRY };
}
