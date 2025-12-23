// ============================================
// Blade & Soul Neo EU Field Boss Timer
// Day-based schedule system
// ============================================

// Cache Version Check - Force reload if stale CSS/JS
const CACHE_VERSION = "1.7.2";
const currentVersion = localStorage.getItem("app-version");
if (currentVersion !== CACHE_VERSION) {
  localStorage.setItem("app-version", CACHE_VERSION);
  if (!sessionStorage.getItem("reloaded-for-version")) {
    sessionStorage.setItem("reloaded-for-version", "true");
    window.location.reload(true);
  }
}

// State Management
const state = {
  bosses: {},
  bossStates: new Map(), // Tracks state per spawn: { status, spawningEndTime, alarmPlayed, notificationSent }
  audioEnabled: false,
  volume: 0.5,
  notificationsEnabled: false,
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
  initializeTheme();

  // Show skeleton loader
  showSkeletonLoader();

  await loadBosses();
  renderBossList();

  // Hide loading bar after content loads
  setTimeout(() => {
    const loadingBar = document.getElementById("loading-bar");
    if (loadingBar) {
      loadingBar.classList.add("hidden");
    }
  }, 300);

  startTimerLoop();
  requestNotificationPermission();

  // Setup Intersection Observer for animations
  setupAnimationObserver();

  // Setup theme toggle button
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  // Setup export calendar button
  const exportBtn = document.getElementById("export-calendar-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportToCalendar);
  }

  // Setup notification toggle button
  const notifBtn = document.getElementById("notification-toggle-btn");
  if (notifBtn) {
    notifBtn.addEventListener("click", toggleNotifications);
    updateNotificationButton();
  }

  // Setup mobile swipe gestures
  setupSwipeGestures();

  // Register service worker for PWA (DISABLED - causing cache issues)
  // registerServiceWorker();
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

    // Get last modified time from response headers
    const lastModified = response.headers.get("last-modified");
    updateLastModifiedTime(lastModified);
  } catch (error) {
    console.error("Error loading bosses:", error);
    bossContainer.innerHTML =
      '<p class="loading">Error loading boss data. Please refresh.</p>';
  }
}

function updateLastModifiedTime(lastModified) {
  const updateTimeEl = document.getElementById("update-time");
  if (!updateTimeEl) return;

  if (lastModified) {
    const date = new Date(lastModified);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeAgo = "";
    if (diffMins < 1) {
      timeAgo = "just now";
    } else if (diffMins < 60) {
      timeAgo = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else {
      timeAgo = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }

    updateTimeEl.textContent = timeAgo;
    updateTimeEl.title = date.toLocaleString("en-US", {
      dateStyle: "full",
      timeStyle: "short",
    });

    // Add freshness indicator
    if (diffHours < 24) {
      updateTimeEl.classList.add("fresh");
    } else if (diffDays < 7) {
      updateTimeEl.classList.add("recent");
    } else {
      updateTimeEl.classList.add("old");
    }
  } else {
    updateTimeEl.textContent = "Unknown";
  }
}

// ============================================
// Loading & Animations
// ============================================

function showSkeletonLoader() {
  bossContainer.innerHTML = `
    <div class="skeleton-container">
      <div class="skeleton-region">
        <div class="skeleton-heading"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
      </div>
      <div class="skeleton-region">
        <div class="skeleton-heading"></div>
        <div class="skeleton-item"></div>
        <div class="skeleton-item"></div>
      </div>
    </div>
  `;
}

function setupAnimationObserver() {
  // Animate elements as they enter viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "50px" }
  );

  // Observe all boss items and sections
  document.querySelectorAll(".region-section, .boss-item").forEach((el) => {
    el.classList.add("animate-ready");
    observer.observe(el);
  });
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

      // Create elements safely to prevent XSS
      const bossInfo = document.createElement("div");
      bossInfo.className = "boss-info";

      const bossName = document.createElement("span");
      bossName.className = "boss-name";
      bossName.textContent = spawn.location; // Safe: textContent escapes HTML

      const bossTime = document.createElement("span");
      bossTime.className = "boss-time-scheduled";
      bossTime.textContent = spawn.time; // Safe: textContent escapes HTML

      bossInfo.appendChild(bossName);
      bossInfo.appendChild(bossTime);

      const timerDisplay = document.createElement("div");
      timerDisplay.className = "timer-display";

      const bossTimer = document.createElement("span");
      bossTimer.className = "boss-timer";
      bossTimer.textContent = "--:--:--";

      const bossStatus = document.createElement("span");
      bossStatus.className = "boss-status";

      timerDisplay.appendChild(bossTimer);
      timerDisplay.appendChild(bossStatus);

      li.appendChild(bossInfo);
      li.appendChild(timerDisplay);
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

      // Parse spawn time as UTC+1 (server time) and convert to local
      const [hours, minutes] = spawn.time.split(":").map(Number);
      // Create UTC date and add 1 hour for UTC+1 server time
      const spawnTime = new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours - 1, // Subtract 1 to convert UTC+1 to UTC
          minutes,
          0,
          0
        )
      );

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

        // Send browser notification
        if (!spawnState.notificationSent && state.notificationsEnabled) {
          spawnState.notificationSent = true;
          sendBossNotification(spawn.location, region, diffSeconds);
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
// Browser Notifications
// ============================================

function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") {
    state.notificationsEnabled = true;
    updateNotificationButton();
  } else if (Notification.permission !== "denied") {
    // Don't auto-request, let user click the button
    console.log("Notification permission not yet requested");
  }
}

function toggleNotifications() {
  if (!("Notification" in window)) {
    alert("❌ Your browser doesn't support notifications!");
    return;
  }

  if (Notification.permission === "granted") {
    // Toggle on/off
    state.notificationsEnabled = !state.notificationsEnabled;
    updateNotificationButton();

    // Show confirmation
    if (state.notificationsEnabled) {
      sendTestNotification();
    }
  } else if (Notification.permission === "denied") {
    alert(
      "🔕 Notifications are blocked. Please enable them in your browser settings."
    );
  } else {
    // Request permission
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        state.notificationsEnabled = true;
        updateNotificationButton();
        sendTestNotification();
      } else {
        alert("❌ Notification permission denied. Click again to retry.");
      }
    });
  }
}

function updateNotificationButton() {
  const btn = document.getElementById("notification-toggle-btn");
  if (!btn) return;

  if (!("Notification" in window)) {
    btn.textContent = "🔕 Not Supported";
    btn.disabled = true;
    btn.title = "Your browser doesn't support notifications";
    return;
  }

  if (Notification.permission === "denied") {
    btn.textContent = "🔕 Blocked";
    btn.title = "Notifications blocked. Enable in browser settings.";
    return;
  }

  if (state.notificationsEnabled) {
    btn.textContent = "🔔 Notifications ON";
    btn.title = "Click to disable browser notifications";
    btn.classList.add("active");
  } else {
    btn.textContent = "🔕 Notifications OFF";
    btn.title = "Click to enable browser notifications";
    btn.classList.remove("active");
  }
}

function sendBossNotification(location, region, secondsUntilSpawn) {
  if (!state.notificationsEnabled || Notification.permission !== "granted") {
    return;
  }

  const minutes = Math.floor(secondsUntilSpawn / 60);
  const seconds = secondsUntilSpawn % 60;
  const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const notification = new Notification("🗡️ BNS Field Boss Spawning Soon!", {
    body: `${location} (${region})\nSpawns in ${timeString}\nGet ready!`,
    icon: "https://hayderch.github.io/bns-neo-boss-timer/favicon.ico",
    badge: "https://hayderch.github.io/bns-neo-boss-timer/favicon.ico",
    tag: `boss-${region}-${location}`,
    requireInteraction: false,
    silent: false,
  });

  // Auto-close after 10 seconds
  setTimeout(() => notification.close(), 10000);

  // Handle notification click
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
}

function sendTestNotification() {
  if (Notification.permission !== "granted") return;

  const notification = new Notification("✅ Notifications Enabled!", {
    body: "You'll now receive alerts when bosses are spawning soon.",
    icon: "https://hayderch.github.io/bns-neo-boss-timer/favicon.ico",
    tag: "test-notification",
    requireInteraction: false,
  });

  setTimeout(() => notification.close(), 5000);
}

// ============================================
// Theme System
// ============================================

function initializeTheme() {
  // Check localStorage first, then system preference
  const savedTheme = localStorage.getItem("bns-theme");

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Detect system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem("bns-theme")) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);
  localStorage.setItem("bns-theme", newTheme);
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }

  updateThemeButton(theme);
}

function updateThemeButton(theme) {
  const btn = document.getElementById("theme-toggle-btn");
  if (!btn) return;

  if (theme === "light") {
    btn.textContent = "☀️ Light Mode";
    btn.title = "Switch to dark mode";
  } else {
    btn.textContent = "🌙 Dark Mode";
    btn.title = "Switch to light mode";
  }
}

// ============================================
// Mobile Swipe Gestures
// ============================================

function setupSwipeGestures() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const minSwipeDistance = 50;
  const maxVerticalDistance = 100;

  bossContainer.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  bossContainer.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const horizontalDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(touchEndY - touchStartY);

    // Only trigger swipe if horizontal movement is significant and vertical is minimal
    if (
      Math.abs(horizontalDistance) < minSwipeDistance ||
      verticalDistance > maxVerticalDistance
    ) {
      return;
    }

    if (horizontalDistance > 0) {
      // Swipe right - refresh data
      showSwipeHint("↻ Refreshing boss list...");
      renderBossList();
      setTimeout(() => hideSwipeHint(), 1500);
    } else {
      // Swipe left - scroll to bottom
      showSwipeHint("↓ Scrolling to bottom");
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      setTimeout(() => hideSwipeHint(), 1000);
    }
  }
}

function showSwipeHint(message) {
  let hint = document.getElementById("swipe-hint");

  if (!hint) {
    hint = document.createElement("div");
    hint.id = "swipe-hint";
    hint.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 15px 25px;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      pointer-events: none;
      animation: swipeHintFade 0.3s ease-out;
    `;
    document.body.appendChild(hint);

    // Add animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes swipeHintFade {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  hint.textContent = message;
  hint.style.display = "block";
}

function hideSwipeHint() {
  const hint = document.getElementById("swipe-hint");
  if (hint) {
    hint.style.opacity = "0";
    hint.style.transition = "opacity 0.3s";
    setTimeout(() => {
      hint.style.display = "none";
      hint.style.opacity = "1";
    }, 300);
  }
}

// ============================================
// Progressive Web App (PWA)
// ============================================

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/bns-neo-boss-timer/sw.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered:", registration.scope);

        // Check for updates every hour
        setInterval(() => {
          registration.update();
        }, 3600000);

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New version available - show update prompt
              showUpdatePrompt();
            }
          });
        });
      })
      .catch((error) => {
        console.error("[PWA] Service Worker registration failed:", error);
      });

    // Handle install prompt
    let deferredPrompt;
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      showInstallPrompt(deferredPrompt);
    });

    // Track install
    window.addEventListener("appinstalled", () => {
      console.log("[PWA] App installed successfully");
      hideInstallPrompt();
    });
  }
}

function showInstallPrompt(deferredPrompt) {
  // Create install banner
  const banner = document.createElement("div");
  banner.id = "install-banner";
  banner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    display: flex;
    gap: 15px;
    align-items: center;
    animation: slideUp 0.3s ease-out;
    max-width: 90%;
  `;

  banner.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 600; margin-bottom: 5px;">📱 Install BNS Timer</div>
      <div style="font-size: 0.85rem; opacity: 0.9;">Add to home screen for quick access</div>
    </div>
    <button id="install-btn" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Install</button>
    <button id="dismiss-btn" style="background: transparent; color: white; border: 1px solid rgba(255,255,255,0.5); padding: 10px 15px; border-radius: 8px; cursor: pointer;">Later</button>
  `;

  document.body.appendChild(banner);

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateX(-50%) translateY(100px); opacity: 0; }
      to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  // Handle install
  document.getElementById("install-btn").addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("[PWA] Install outcome:", outcome);
      deferredPrompt = null;
    }
    hideInstallPrompt();
  });

  // Handle dismiss
  document
    .getElementById("dismiss-btn")
    .addEventListener("click", hideInstallPrompt);
}

function hideInstallPrompt() {
  const banner = document.getElementById("install-banner");
  if (banner) {
    banner.style.animation = "slideDown 0.3s ease-out";
    setTimeout(() => banner.remove(), 300);
  }
}

function showUpdatePrompt() {
  const banner = document.createElement("div");
  banner.id = "update-banner";
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    display: flex;
    gap: 15px;
    align-items: center;
    animation: slideDown 0.3s ease-out;
    max-width: 90%;
  `;

  banner.innerHTML = `
    <div style="flex: 1;">
      <div style="font-weight: 600;">✨ Update Available</div>
      <div style="font-size: 0.85rem; opacity: 0.9;">Reload to get the latest version</div>
    </div>
    <button id="reload-btn" style="background: white; color: #f39c12; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">Reload</button>
  `;

  document.body.appendChild(banner);

  document.getElementById("reload-btn").addEventListener("click", () => {
    window.location.reload();
  });
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

// ============================================
// Export to Calendar
// ============================================

function exportToCalendar() {
  const now = new Date();
  const currentDay = DAYS[now.getDay()];

  let events = [];

  // Collect all today's spawns from all regions
  for (const [region, schedule] of Object.entries(state.bosses)) {
    if (schedule.note) continue; // Skip regions with notes

    const todaySchedule = schedule[currentDay] || [];

    todaySchedule.forEach((spawn) => {
      const [hours, minutes] = spawn.time.split(":").map(Number);
      // Create UTC date and add 1 hour for UTC+1 server time
      const spawnTime = new Date(
        Date.UTC(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          hours - 1, // Subtract 1 to convert UTC+1 to UTC
          minutes,
          0,
          0
        )
      );

      events.push({
        time: spawnTime,
        location: spawn.location,
        region: region,
      });
    });
  }

  // Sort by time
  events.sort((a, b) => a.time - b.time);

  if (events.length === 0) {
    alert("⚠️ No boss spawns scheduled for today!");
    return;
  }

  // Generate ICS file
  const ics = generateICS(events, currentDay);

  // Download file
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `BNS-Field-Bosses-${currentDay}-${
    now.toISOString().split("T")[0]
  }.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);

  // Show success message
  const exportBtn = document.getElementById("export-calendar-btn");
  const originalText = exportBtn.textContent;
  exportBtn.textContent = "✅ Downloaded!";
  exportBtn.disabled = true;

  setTimeout(() => {
    exportBtn.textContent = originalText;
    exportBtn.disabled = false;
  }, 2000);
}

function generateICS(events, dayName) {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BNS Neo Field Boss Timer//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:BNS Field Bosses - " + dayName,
    "X-WR-TIMEZONE:UTC",
  ];

  events.forEach((event, index) => {
    const startTime = event.time;
    const endTime = new Date(startTime.getTime() + 5 * 60 * 1000); // 5 min spawn window

    const formatICSDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };

    ics.push("BEGIN:VEVENT");
    ics.push(`UID:bns-boss-${timestamp}-${index}@hayderch.github.io`);
    ics.push(`DTSTAMP:${timestamp}`);
    ics.push(`DTSTART:${formatICSDate(startTime)}`);
    ics.push(`DTEND:${formatICSDate(endTime)}`);
    ics.push(`SUMMARY:🗡️ BNS Field Boss - ${event.location}`);
    ics.push(
      `DESCRIPTION:Field Boss spawn in ${event.region} at ${event.location}\nPrepare 5 minutes before!`
    );
    ics.push(`LOCATION:${event.region} - ${event.location}`);

    // Add alarm 5 minutes before
    ics.push("BEGIN:VALARM");
    ics.push("TRIGGER:-PT5M");
    ics.push("ACTION:DISPLAY");
    ics.push(`DESCRIPTION:Boss spawning soon at ${event.location}!`);
    ics.push("END:VALARM");

    ics.push("END:VEVENT");
  });

  ics.push("END:VCALENDAR");

  return ics.join("\r\n");
}

// ============================================
// SF CALCULATOR SYSTEM
// ============================================

// Input Sanitization
function sanitizeSFInput(value) {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0 || parsed > 999999) {
    return null;
  }
  return parsed;
}

function validateRequirements(minSF, maxAvg) {
  if (minSF === null || maxAvg === null) return false;
  if (minSF > maxAvg) return false;
  if (minSF < 0 || maxAvg < 0) return false;
  return true;
}

// Dungeon Manager Class
class DungeonManager {
  constructor() {
    this.presets =
      typeof DUNGEON_PRESETS !== "undefined" ? DUNGEON_PRESETS : [];
    this.currentDungeon = null;
    this.currentMinSF = null;
    this.currentMaxAvg = null;
  }

  selectDungeon(dungeonId) {
    if (dungeonId === "manual") {
      this.currentDungeon = null;
      this.currentMinSF = null;
      this.currentMaxAvg = null;
      return null;
    }

    this.currentDungeon = this.presets.find((d) => d.id === dungeonId);
    if (this.currentDungeon) {
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

// SF Calculator Class
class SFCalculator {
  constructor(dungeonManager) {
    this.dungeonManager = dungeonManager;
    this.party = Array(6).fill(null);
  }

  updateRequirements() {
    const reqs = this.dungeonManager.getCurrentRequirements();
    this.minSF = reqs.minSF;
    this.maxAvg = reqs.maxAvg;
  }

  setMember(index, sfValue) {
    if (index < 0 || index >= 6) return false;

    const sanitized = sanitizeSFInput(sfValue);
    if (sanitized === null) return false;

    this.party[index] = sanitized;
    return true;
  }

  clearMember(index) {
    if (index >= 0 && index < 6) {
      this.party[index] = null;
      return true;
    }
    return false;
  }

  getValidRange() {
    if (this.minSF === null || this.maxAvg === null) {
      return { status: "no-requirements" };
    }

    const filled = this.party.filter((sf) => sf !== null);
    const sum = filled.reduce((a, b) => a + b, 0);
    const remaining = 6 - filled.length;

    if (remaining === 0) return { status: "full" };

    const maxSum = this.maxAvg * 6;
    const budget = maxSum - sum;

    // Recommended target: average needed for remaining slots
    const recommendedTarget = Math.round(budget / remaining);

    // Absolute maximum: if all other remaining slots are at minimum
    const absoluteMax = Math.floor(budget - this.minSF * (remaining - 1));

    // Check if it's still possible to form valid party
    const isImpossible = absoluteMax < 0;

    return {
      recommended: recommendedTarget,
      absoluteMax: absoluteMax,
      budget: budget,
      remaining: remaining,
      status: isImpossible ? "impossible" : "valid",
    };
  }

  getCurrentAverage() {
    const filled = this.party.filter((sf) => sf !== null);
    if (filled.length === 0) return 0;
    return Math.round(filled.reduce((a, b) => a + b, 0) / filled.length);
  }

  getFilledCount() {
    return this.party.filter((sf) => sf !== null).length;
  }

  reset() {
    this.party = Array(6).fill(null);
  }
}

// SF Calculator UI Manager
class SFCalculatorUI {
  constructor() {
    this.dungeonManager = new DungeonManager();
    this.calculator = new SFCalculator(this.dungeonManager);
    this.initializeElements();
    this.bindEvents();
    this.populateDungeonDropdown();
    this.createPartySlots();
  }

  initializeElements() {
    this.dungeonSelector = document.getElementById("dungeon-selector");
    this.minSFInput = document.getElementById("min-sf-input");
    this.maxAvgInput = document.getElementById("max-avg-input");
    this.resetPresetBtn = document.getElementById("reset-preset-btn");
    this.partySlotsContainer = document.getElementById("party-slots");
    this.currentAvgDisplay = document.getElementById("current-avg");
    this.budgetRemainingDisplay = document.getElementById("budget-remaining");
    this.statusIndicator = document.getElementById("party-status-indicator");
    this.modifiedIndicator = document.getElementById("modified-indicator");
    this.resetPartyBtn = document.getElementById("reset-party-btn");
    this.copyWorldChatBtn = document.getElementById("copy-world-chat-btn");
    this.toleranceInput = document.getElementById("tolerance-input");
  }

  populateDungeonDropdown() {
    this.dungeonManager.presets.forEach((dungeon) => {
      const option = document.createElement("option");
      option.value = dungeon.id;
      option.textContent = dungeon.name;
      if (dungeon.note) {
        option.textContent += ` (${dungeon.note})`;
      }
      this.dungeonSelector.appendChild(option);
    });
  }

  createPartySlots() {
    for (let i = 0; i < 6; i++) {
      const slotDiv = document.createElement("div");
      slotDiv.className = "party-slot";
      slotDiv.innerHTML = `
        <div class="slot-header">
          <span class="slot-label">Slot ${i + 1}${
        i === 0 ? " (You)" : ""
      }</span>
          ${
            i > 0
              ? '<button class="clear-slot-btn hidden" data-slot="' +
                i +
                '">✕</button>'
              : ""
          }
        </div>
        <input type="number" 
               class="slot-input" 
               data-slot="${i}"
               placeholder="${i === 0 ? "Your SF" : "Recruit SF"}"
               min="0"
               step="1">
        <div class="slot-range hidden">
          <span class="range-label">Valid range:</span>
          <span class="range-value">—</span>
        </div>
      `;
      this.partySlotsContainer.appendChild(slotDiv);
    }
  }

  bindEvents() {
    this.dungeonSelector.addEventListener("change", () =>
      this.onDungeonChange()
    );
    this.minSFInput.addEventListener("input", () =>
      this.onRequirementsChange()
    );
    this.maxAvgInput.addEventListener("input", () =>
      this.onRequirementsChange()
    );
    this.resetPresetBtn.addEventListener("click", () => this.onResetPreset());
    this.resetPartyBtn.addEventListener("click", () => this.onResetParty());
    this.copyWorldChatBtn.addEventListener("click", () =>
      this.copyForWorldChat()
    );

    // Party slot inputs
    this.partySlotsContainer.addEventListener("input", (e) => {
      if (e.target.classList.contains("slot-input")) {
        const slot = parseInt(e.target.dataset.slot);
        this.onSlotInput(slot, e.target.value);
      }
    });

    // Clear buttons
    this.partySlotsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("clear-slot-btn")) {
        const slot = parseInt(e.target.dataset.slot);
        this.onClearSlot(slot);
      }
    });
  }

  onDungeonChange() {
    const dungeonId = this.dungeonSelector.value;
    this.dungeonManager.selectDungeon(dungeonId);

    const reqs = this.dungeonManager.getCurrentRequirements();
    this.minSFInput.value = reqs.minSF !== null ? reqs.minSF : "";
    this.maxAvgInput.value = reqs.maxAvg !== null ? reqs.maxAvg : "";

    this.updateModifiedIndicator();
    this.updateCalculator();

    // Force re-validation of all filled slots after dungeon change
    setTimeout(() => this.updateCalculator(), 0);
  }

  onRequirementsChange() {
    this.dungeonManager.setMinSF(this.minSFInput.value);
    this.dungeonManager.setMaxAvg(this.maxAvgInput.value);
    this.updateModifiedIndicator();
    this.updateCalculator();

    // Force re-validation of all filled slots after requirement change
    setTimeout(() => this.updateCalculator(), 0);
  }

  onResetPreset() {
    this.dungeonManager.resetToPreset();
    const reqs = this.dungeonManager.getCurrentRequirements();
    this.minSFInput.value = reqs.minSF !== null ? reqs.minSF : "";
    this.maxAvgInput.value = reqs.maxAvg !== null ? reqs.maxAvg : "";
    this.updateModifiedIndicator();
    this.updateCalculator();
  }

  onSlotInput(slot, value) {
    if (value.trim() === "") {
      this.calculator.clearMember(slot);
    } else {
      this.calculator.setMember(slot, value);
    }
    this.updateSlotClearButton(slot);
    this.updateCalculator();
  }

  onClearSlot(slot) {
    this.calculator.clearMember(slot);
    const input = this.partySlotsContainer.querySelector(
      `input[data-slot="${slot}"]`
    );
    if (input) input.value = "";
    this.updateSlotClearButton(slot);
    this.updateCalculator();
  }

  onResetParty() {
    this.calculator.reset();
    const inputs = this.partySlotsContainer.querySelectorAll(".slot-input");
    inputs.forEach((input) => (input.value = ""));
    this.updateCalculator();
  }

  copyForWorldChat() {
    const reqs = this.dungeonManager.getCurrentRequirements();
    const filledCount = this.calculator.getFilledCount();
    const remainingCount = 6 - filledCount;
    const tolerance = parseInt(this.toleranceInput.value) || 0;

    // Get dungeon name
    let dungeonName = "SF Calculator";
    if (this.dungeonSelector.value !== "manual") {
      const selectedDungeon = this.dungeonManager.presets.find(
        (d) => d.id === this.dungeonSelector.value
      );
      if (selectedDungeon) {
        dungeonName = selectedDungeon.name;
      }
    }

    // Build recruitment message
    let message = "";

    if (reqs.minSF && reqs.maxAvg && remainingCount > 0) {
      // Calculate target from recommended range
      const range = this.calculator.getValidRange();
      const targetSF = range.recommended > 0 ? range.recommended : reqs.minSF;
      const targetK = Math.round(targetSF / 1000);

      // Format SF requirement based on tolerance
      let sfRequirement = "";
      if (tolerance === 0) {
        // Exact target
        sfRequirement = `${targetK}k SF`;
      } else {
        // Flexible range
        const minK = Math.max(0, targetK - tolerance);
        const maxK = targetK + tolerance;
        sfRequirement = `${minK}k-${maxK}k SF`;
      }

      // Build message
      message = `${dungeonName} | Need ${remainingCount} more, ${sfRequirement} | Apply ${filledCount}/6`;
    } else if (remainingCount === 0) {
      // Party full
      message = `${dungeonName} | Party full | 6/6`;
    } else {
      // No requirements set
      message = `${dungeonName} | Need ${remainingCount} more | Apply ${filledCount}/6`;
    }

    // Copy to clipboard
    navigator.clipboard
      .writeText(message)
      .then(() => {
        // Show success feedback
        const originalText = this.copyWorldChatBtn.textContent;
        this.copyWorldChatBtn.textContent = "✓ Copied!";
        this.copyWorldChatBtn.style.backgroundColor = "#27ae60";
        setTimeout(() => {
          this.copyWorldChatBtn.textContent = originalText;
          this.copyWorldChatBtn.style.backgroundColor = "";
        }, 1500);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        // Fallback: show text in alert
        alert(`Copy this:\n\n${message}`);
      });
  }

  updateSlotClearButton(slot) {
    const clearBtn = this.partySlotsContainer.querySelector(
      `.clear-slot-btn[data-slot="${slot}"]`
    );
    if (clearBtn) {
      const input = this.partySlotsContainer.querySelector(
        `input[data-slot="${slot}"]`
      );
      if (input && input.value.trim() !== "") {
        clearBtn.classList.remove("hidden");
      } else {
        clearBtn.classList.add("hidden");
      }
    }
  }

  updateModifiedIndicator() {
    const reqs = this.dungeonManager.getCurrentRequirements();
    if (reqs.isModified) {
      this.modifiedIndicator.classList.remove("hidden");
      this.resetPresetBtn.classList.remove("hidden");
    } else {
      this.modifiedIndicator.classList.add("hidden");
      if (this.dungeonSelector.value === "manual") {
        this.resetPresetBtn.classList.add("hidden");
      }
    }
  }

  updateCalculator() {
    this.calculator.updateRequirements();
    const range = this.calculator.getValidRange();
    const filledCount = this.calculator.getFilledCount();

    // Update current average
    const avg = this.calculator.getCurrentAverage();
    this.currentAvgDisplay.textContent =
      avg > 0 ? `${avg.toLocaleString()} SF` : "—";

    // Update budget
    if (range.status === "valid" || range.status === "impossible") {
      this.budgetRemainingDisplay.textContent = `${range.budget.toLocaleString()} SF for ${
        range.remaining
      } slot${range.remaining !== 1 ? "s" : ""}`;
    } else {
      this.budgetRemainingDisplay.textContent = "—";
    }

    // Update status indicator
    this.updateStatusIndicator(range, filledCount);

    // Update slot ranges
    this.updateSlotRanges(range, filledCount);
  }

  updateStatusIndicator(range, filledCount) {
    let statusText = "";
    let statusClass = "";

    if (range.status === "no-requirements") {
      statusText = "⚠️ Enter requirements to start";
      statusClass = "status-warning";
    } else if (range.status === "full") {
      const reqs = this.dungeonManager.getCurrentRequirements();
      const avg = this.calculator.getCurrentAverage();

      // Check if any member is below minimum SF
      const membersBelowMin = this.calculator.party.filter(
        (sf) => sf !== null && sf < reqs.minSF
      );

      if (membersBelowMin.length > 0) {
        statusText = `❌ Challenge Mode Unavailable - ${
          membersBelowMin.length
        } member(s) below Min SF (${reqs.minSF.toLocaleString()})`;
        statusClass = "status-error";
      } else if (avg > reqs.maxAvg) {
        statusText = `❌ Challenge Mode Unavailable - Party Average Too High (${avg.toLocaleString()} > ${reqs.maxAvg.toLocaleString()})`;
        statusClass = "status-error";
      } else {
        statusText = "✅ Party Complete & Valid!";
        statusClass = "status-success";
      }
    } else if (range.status === "impossible") {
      statusText = "❌ Impossible to fill (over budget)";
      statusClass = "status-error";
    } else if (range.status === "valid") {
      const reqs = this.dungeonManager.getCurrentRequirements();
      const membersBelowMin = this.calculator.party.filter(
        (sf) => sf !== null && sf < reqs.minSF
      );

      if (membersBelowMin.length > 0) {
        statusText = `⚠️ ${
          membersBelowMin.length
        } member(s) below Min SF (${reqs.minSF.toLocaleString()}) - Challenge Mode will be unavailable`;
        statusClass = "status-warning";
      } else if (filledCount === 0) {
        statusText = "⚪ Ready to build party";
        statusClass = "status-neutral";
      } else {
        const flexibility = range.absoluteMax - range.recommended;
        if (flexibility < 500) {
          statusText = "🟡 Very limited flexibility";
          statusClass = "status-warning";
        } else if (flexibility < 2000) {
          statusText = "🟡 Limited flexibility";
          statusClass = "status-warning";
        } else {
          statusText = "🟢 Party is Valid";
          statusClass = "status-success";
        }
      }
    }

    this.statusIndicator.textContent = statusText;
    this.statusIndicator.className =
      "status-value status-indicator " + statusClass;
  }

  updateSlotRanges(range, filledCount) {
    const reqs = this.dungeonManager.getCurrentRequirements();
    const slots = this.partySlotsContainer.querySelectorAll(".party-slot");

    slots.forEach((slot, index) => {
      const input = slot.querySelector(".slot-input");
      const rangeDisplay = slot.querySelector(".slot-range");
      const rangeValue = slot.querySelector(".range-value");

      const isFilled = input.value.trim() !== "";
      const sfValue = parseInt(input.value, 10);

      if (isFilled) {
        // Show validation for filled slots
        rangeDisplay.classList.remove("hidden");

        if (
          reqs.minSF !== null &&
          reqs.minSF !== undefined &&
          sfValue < reqs.minSF
        ) {
          rangeValue.textContent = `⚠️ Below Min SF (${reqs.minSF.toLocaleString()})`;
          rangeValue.className = "range-value status-warning";
          input.classList.add("input-warning");
          input.classList.remove("input-valid");
        } else if (reqs.minSF !== null && reqs.minSF !== undefined) {
          rangeValue.textContent = `✓ Valid (${sfValue.toLocaleString()} SF)`;
          rangeValue.className = "range-value status-success";
          input.classList.add("input-valid");
          input.classList.remove("input-warning");
        } else {
          rangeDisplay.classList.add("hidden");
          input.classList.remove("input-valid", "input-warning");
        }
      } else if (!isFilled && filledCount < 6) {
        // Show recommendations for empty slots
        input.classList.remove("input-valid", "input-warning");

        if (range.status === "valid" || range.status === "impossible") {
          rangeDisplay.classList.remove("hidden");

          if (range.status === "impossible") {
            rangeValue.textContent = "❌ Over budget";
            rangeValue.className = "range-value status-error";
          } else {
            // Show recommended target and absolute max
            const recommended = range.recommended.toLocaleString();
            const absMax = range.absoluteMax.toLocaleString();
            rangeValue.textContent = `🎯 Target: ${recommended} | Max: ${absMax}`;

            // Color based on flexibility
            const flexibility = range.absoluteMax - range.recommended;
            if (flexibility < 1000) {
              rangeValue.className = "range-value status-warning";
            } else {
              rangeValue.className = "range-value status-success";
            }
          }
        } else {
          rangeDisplay.classList.add("hidden");
        }
      } else {
        rangeDisplay.classList.add("hidden");
        input.classList.remove("input-valid", "input-warning");
      }
    });
  }
}

// Navigation System
function initializeNavigation() {
  const navButtons = document.querySelectorAll(".nav-tab");
  const toolViews = document.querySelectorAll(".tool-view");

  function showTool(toolName) {
    // Update nav buttons
    navButtons.forEach((btn) => {
      if (btn.dataset.tool === toolName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update views
    toolViews.forEach((view) => {
      if (
        view.id === `${toolName}-container` ||
        (toolName === "timer" && view.id === "boss-container")
      ) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // Update URL hash
    window.location.hash = toolName;

    // Update page title
    if (toolName === "sf-calculator") {
      document.title = "SF Calculator - Blade & Soul Neo Tools";
    } else {
      document.title =
        "Blade & Soul Neo EU Field Boss Timer by Hayder (Kindle)";
    }
  }

  // Bind navigation clicks
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      showTool(btn.dataset.tool);
    });
  });

  // Handle hash navigation
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1);
    if (hash === "sf-calculator" || hash === "timer") {
      showTool(hash);
    }
  });

  // Initialize from hash or default to timer
  const initialHash = window.location.hash.substring(1);
  if (initialHash === "sf-calculator") {
    showTool("sf-calculator");
  } else {
    showTool("timer");
  }
}

// Initialize SF Calculator when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  initializeNavigation();

  // Initialize SF Calculator if elements exist
  if (document.getElementById("sf-calculator-container")) {
    window.sfCalculatorUI = new SFCalculatorUI();
  }
});
