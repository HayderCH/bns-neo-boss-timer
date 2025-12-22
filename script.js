// ============================================
// Blade & Soul Neo EU Field Boss Timer
// Day-based schedule system
// ============================================

// State Management
const state = {
  bosses: {},
  bossStates: new Map(), // Tracks state per spawn: { status, spawningEndTime, alarmPlayed }
  audioEnabled: false,
  volume: 0.5,
};

// Day names for schedule lookup
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// DOM Elements
let alarmSound;
let volumeSlider;
let volumeValue;
let bossContainer;

// ============================================
// Initialization
// ============================================

document.addEventListener("DOMContentLoaded", async () => {
  alarmSound = document.getElementById("alarm-sound");
  volumeSlider = document.getElementById("volume-slider");
  volumeValue = document.getElementById("volume-value");
  bossContainer = document.getElementById("boss-container");

  setupAudio();
  await loadBosses();
  renderBossList();
  startTimerLoop();
});

// Enable audio on first user interaction
document.addEventListener(
  "click",
  () => {
    if (!state.audioEnabled) {
      state.audioEnabled = true;
      const footer = document.querySelector("footer");
      footer.textContent = "🔊 Sound notifications enabled!";
      footer.classList.add("sound-enabled");

      // Test play to unlock audio
      alarmSound.volume = 0;
      alarmSound
        .play()
        .then(() => {
          alarmSound.pause();
          alarmSound.currentTime = 0;
          alarmSound.volume = state.volume;
        })
        .catch(() => {});
    }
  },
  { once: true }
);

// ============================================
// Audio Setup
// ============================================

// Web Audio API context for fallback beep
let audioContext = null;

function setupAudio() {
  volumeSlider.addEventListener("input", (e) => {
    const value = e.target.value;
    state.volume = value / 100;
    alarmSound.volume = state.volume;
    volumeValue.textContent = `${value}%`;
  });
}

function playBeep() {
  // Fallback beep using Web Audio API
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = "sine";
  gainNode.gain.value = state.volume;

  oscillator.start();

  // Beep pattern: 3 beeps
  setTimeout(() => {
    gainNode.gain.value = 0;
  }, 200);
  setTimeout(() => {
    gainNode.gain.value = state.volume;
  }, 300);
  setTimeout(() => {
    gainNode.gain.value = 0;
  }, 500);
  setTimeout(() => {
    gainNode.gain.value = state.volume;
  }, 600);
  setTimeout(() => {
    gainNode.gain.value = 0;
  }, 800);
  setTimeout(() => {
    oscillator.stop();
  }, 900);
}

function playAlarm() {
  if (state.audioEnabled && state.volume > 0) {
    // Try MP3 first, fallback to beep
    alarmSound.currentTime = 0;
    alarmSound.play().catch(() => {
      playBeep();
    });

    // Also play beep as backup
    playBeep();
  }
}

// ============================================
// Data Loading
// ============================================

async function loadBosses() {
  try {
    const response = await fetch("bosses.json");
    if (!response.ok) throw new Error("Failed to load bosses.json");
    state.bosses = await response.json();
  } catch (error) {
    console.error("Error loading bosses:", error);
    bossContainer.innerHTML =
      '<p class="loading">Error loading boss data. Please refresh.</p>';
  }
}

// ============================================
// Render DOM
// ============================================

function renderBossList() {
  bossContainer.innerHTML = "";

  const now = new Date();
  const currentDay = DAYS[now.getDay()];

  // Create horizontal container for regions
  const regionsContainer = document.createElement("div");
  regionsContainer.className = "regions-container";

  for (const [region, schedule] of Object.entries(state.bosses)) {
    const section = document.createElement("section");
    section.className = "region-section";

    const heading = document.createElement("h2");
    heading.textContent = `${region} — ${currentDay}`;
    section.appendChild(heading);

    // Check if region has a note (placeholder)
    if (schedule.note) {
      const note = document.createElement("p");
      note.className = "region-note";
      note.textContent = schedule.note;
      section.appendChild(note);
      regionsContainer.appendChild(section);
      continue;
    }

    // Get today's schedule
    const todaySchedule = schedule[currentDay] || [];

    if (todaySchedule.length === 0) {
      const note = document.createElement("p");
      note.className = "region-note";
      note.innerHTML = `Not enough data - contribute with boss timers at <a href="https://docs.google.com/spreadsheets/d/1unXxTlJ53VZBLMOs7XtpWqMyWC7WYHQ0KN3MmqejGIY/edit?gid=0#gid=0" target="_blank">this spreadsheet</a> 📝`;
      section.appendChild(note);
      regionsContainer.appendChild(section);
      continue;
    }

    const list = document.createElement("ul");
    list.className = "boss-list";

    todaySchedule.forEach((spawn, index) => {
      const spawnId = `${region}-${currentDay}-${index}`;

      // Initialize spawn state
      state.bossStates.set(spawnId, {
        status: "normal",
        spawningEndTime: null,
        alarmPlayed: false,
      });

      const li = document.createElement("li");
      li.className = "boss-item normal";
      li.id = spawnId;
      li.dataset.time = spawn.time;
      li.dataset.location = spawn.location;
      li.innerHTML = `
        <div class="boss-info">
          <span class="boss-name">${spawn.location}</span>
          <span class="boss-time-scheduled">${spawn.time}</span>
        </div>
        <div class="timer-display">
          <span class="boss-timer">--:--:--</span>
          <span class="boss-status"></span>
        </div>
      `;
      list.appendChild(li);
    });

    section.appendChild(list);
    regionsContainer.appendChild(section);
  }

  bossContainer.appendChild(regionsContainer);
}

// ============================================
// Timer Logic
// ============================================

function startTimerLoop() {
  updateAllCountdowns();
  setInterval(updateAllCountdowns, 1000);

  // Re-render at midnight to switch to new day's schedule
  scheduleMiddnightRefresh();
}

function scheduleMiddnightRefresh() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = midnight - now;

  setTimeout(() => {
    renderBossList();
    scheduleMiddnightRefresh();
  }, msUntilMidnight + 1000);
}

function updateAllCountdowns() {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];

  for (const [region, schedule] of Object.entries(state.bosses)) {
    // Skip regions with just notes
    if (schedule.note) continue;

    const todaySchedule = schedule[currentDay] || [];

    todaySchedule.forEach((spawn, index) => {
      const spawnId = `${region}-${currentDay}-${index}`;
      const element = document.getElementById(spawnId);
      const spawnState = state.bossStates.get(spawnId);

      if (!element || !spawnState) return;

      const timerEl = element.querySelector(".boss-timer");
      const statusEl = element.querySelector(".boss-status");

      // Parse spawn time
      const [hours, minutes] = spawn.time.split(":").map(Number);
      const spawnTime = new Date(now);
      spawnTime.setHours(hours, minutes, 0, 0);

      const diff = spawnTime - now;
      const diffSeconds = Math.floor(diff / 1000);

      // State machine logic
      if (spawnState.status === "spawning") {
        const spawningRemaining = spawnState.spawningEndTime - now;

        if (spawningRemaining <= 0) {
          // Spawning ended - mark as done
          spawnState.status = "done";
          element.className = "boss-item done";
          timerEl.textContent = "DONE";
          statusEl.textContent = "Spawn ended";
          return;
        } else {
          // Still spawning
          element.className = "boss-item spawning";
          timerEl.textContent = formatTime(
            Math.floor(spawningRemaining / 1000)
          );
          statusEl.textContent = "SPAWNING";
          return;
        }
      }

      if (spawnState.status === "done") {
        // Already done, skip
        return;
      }

      // Check if spawn time passed
      if (diffSeconds <= 0 && diffSeconds > -5 * 60) {
        // Within 5 min window after spawn time - start spawning
        if (spawnState.status !== "spawning") {
          spawnState.status = "spawning";
          spawnState.spawningEndTime = new Date(
            spawnTime.getTime() + 5 * 60 * 1000
          );
        }
        element.className = "boss-item spawning";
        const spawningRemaining = spawnState.spawningEndTime - now;
        timerEl.textContent = formatTime(Math.floor(spawningRemaining / 1000));
        statusEl.textContent = "SPAWNING";
        return;
      }

      if (diffSeconds <= -5 * 60) {
        // Spawn passed more than 5 min ago
        spawnState.status = "done";
        element.className = "boss-item done";
        timerEl.textContent = "DONE";
        statusEl.textContent = "Spawn ended";
        return;
      }

      // Future spawn
      if (diffSeconds <= 5 * 60 && diffSeconds > 0) {
        // Soon state - within 5 minutes (PINK)
        element.className = "boss-item soon";
        timerEl.textContent = formatTime(diffSeconds);
        statusEl.textContent = "Spawning soon!";

        if (!spawnState.alarmPlayed) {
          spawnState.alarmPlayed = true;
          playAlarm();
        }
      } else {
        // Normal state
        element.className = "boss-item normal";
        timerEl.textContent = formatTime(diffSeconds);
        statusEl.textContent = "";
      }
    });
  }
}

// ============================================
// Utility Functions
// ============================================

function formatTime(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
