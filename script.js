// ============================================
// Blade & Soul Neo EU Field Boss Timer
// ============================================

// State Management
const state = {
  bosses: {},
  bossStates: new Map(), // Tracks state per boss: { status, spawningEndTime, nextSpawnTime, alarmPlayed }
  audioEnabled: false,
  volume: 0.5,
};

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

  for (const [region, bosses] of Object.entries(state.bosses)) {
    const section = document.createElement("section");
    section.className = "region-section";

    const heading = document.createElement("h2");
    heading.textContent = region;
    section.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "boss-list";

    bosses.forEach((boss, index) => {
      const bossId = `${region}-${index}`;

      // Initialize boss state
      state.bossStates.set(bossId, {
        status: "normal",
        spawningEndTime: null,
        alarmPlayed: false,
      });

      const li = document.createElement("li");
      li.className = "boss-item normal";
      li.id = bossId;
      li.innerHTML = `
                <span class="boss-name">${boss.name}</span>
                <div class="timer-display">
                    <span class="boss-timer">--:--:--</span>
                    <span class="boss-status"></span>
                </div>
            `;
      list.appendChild(li);
    });

    section.appendChild(list);
    bossContainer.appendChild(section);
  }
}

// ============================================
// Timer Logic
// ============================================

function startTimerLoop() {
  updateAllCountdowns();
  setInterval(updateAllCountdowns, 1000);
}

function updateAllCountdowns() {
  const now = new Date();

  for (const [region, bosses] of Object.entries(state.bosses)) {
    bosses.forEach((boss, index) => {
      const bossId = `${region}-${index}`;
      const element = document.getElementById(bossId);
      const bossState = state.bossStates.get(bossId);

      if (!element || !bossState) return;

      const timerEl = element.querySelector(".boss-timer");
      const statusEl = element.querySelector(".boss-status");

      // Get the next spawn time for this boss
      const nextSpawn = getNextSpawnTime(boss.spawns, now);
      const diff = nextSpawn - now;
      const diffSeconds = Math.floor(diff / 1000);

      // State machine logic
      if (bossState.status === "spawning") {
        // Currently in spawning state - show purple timer
        const spawningRemaining = bossState.spawningEndTime - now;

        if (spawningRemaining <= 0) {
          // Spawning timer ended - transition to next state
          bossState.status = "next";
          bossState.spawningEndTime = null;
          bossState.alarmPlayed = false; // Reset for next cycle
        } else {
          // Still spawning - show purple countdown
          element.className = "boss-item spawning";
          timerEl.textContent = formatTime(
            Math.floor(spawningRemaining / 1000)
          );
          statusEl.textContent = "SPAWNING";
          return;
        }
      }

      if (bossState.status === "next" || diffSeconds <= 0) {
        if (diffSeconds <= 0 && bossState.status !== "next") {
          // Timer just hit 0 - start spawning timer
          bossState.status = "spawning";
          bossState.spawningEndTime = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
          element.className = "boss-item spawning";
          timerEl.textContent = "05:00";
          statusEl.textContent = "SPAWNING";
          return;
        }

        if (bossState.status === "next") {
          // After spawning ended - count down to NEXT boss
          const futureSpawn = getNextSpawnTime(boss.spawns, now, true);
          const futureDiff = futureSpawn - now;

          if (futureDiff > 0) {
            element.className = "boss-item next";
            timerEl.textContent = formatTime(Math.floor(futureDiff / 1000));
            statusEl.textContent = "Next spawn";

            // Check if we should transition back to normal/soon
            const futureSeconds = Math.floor(futureDiff / 1000);
            if (futureSeconds <= 5 * 60 && futureSeconds > 0) {
              // Transition to soon state
              bossState.status = "normal";
            } else if (futureSeconds > 5 * 60) {
              // Stay in next but prepare to transition
              bossState.status = "normal";
            }
          }
          return;
        }
      }

      // Normal or Soon state
      if (diffSeconds <= 5 * 60 && diffSeconds > 0) {
        // Soon state - within 5 minutes (PINK)
        element.className = "boss-item soon";
        timerEl.textContent = formatTime(diffSeconds);
        statusEl.textContent = "Spawning soon!";

        // Play alarm once when entering soon state
        if (!bossState.alarmPlayed) {
          bossState.alarmPlayed = true;
          playAlarm();
        }
      } else if (diffSeconds > 5 * 60) {
        // Normal state
        element.className = "boss-item normal";
        timerEl.textContent = formatTime(diffSeconds);
        statusEl.textContent = "";
        bossState.status = "normal";
        bossState.alarmPlayed = false;
      }
    });
  }
}

// ============================================
// Utility Functions
// ============================================

function getNextSpawnTime(spawns, now, skipCurrent = false) {
  const today = new Date(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  let candidates = [];

  // Generate spawn times for today and tomorrow
  spawns.forEach((timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);

    const todaySpawn = new Date(today);
    todaySpawn.setHours(hours, minutes, 0, 0);

    const tomorrowSpawn = new Date(tomorrow);
    tomorrowSpawn.setHours(hours, minutes, 0, 0);

    candidates.push(todaySpawn, tomorrowSpawn);
  });

  // Sort by time
  candidates.sort((a, b) => a - b);

  // Find the next spawn that's in the future
  for (const spawn of candidates) {
    if (skipCurrent) {
      // Skip spawns that are within the current 5-minute window
      if (spawn > now) {
        return spawn;
      }
    } else {
      // Include spawns that just passed (within spawning window)
      const diff = spawn - now;
      if (diff >= -5 * 60 * 1000) {
        // Within 5 minutes past
        return spawn;
      }
    }
  }

  // Fallback to first spawn tomorrow
  return candidates[0];
}

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
