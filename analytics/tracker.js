// ============================================
// BNS Timer Analytics Tracker
// Client-side event tracking with Google Sheets backend
// ============================================

class AnalyticsTracker {
  constructor(config) {
    this.config = config;
    this.lastEventTime = 0;
    this.eventQueue = [];
    this.retryCount = new Map();

    // Load queued events from localStorage if offline mode enabled
    if (this.config.queueOfflineEvents) {
      this.loadQueueFromStorage();
    }

    // Process queue when coming back online
    if (this.config.queueOfflineEvents) {
      window.addEventListener("online", () => this.processQueue());
    }

    // Log initialization
    if (this.config.debug) {
      console.log("[Analytics] Initialized", {
        enabled: this.config.enabled,
        scriptUrl: this.config.scriptUrl,
      });
    }
  }

  /**
   * Track an event
   * @param {string} category - Event category (navigation, buttons, etc.)
   * @param {string} action - Action performed (click, select, etc.)
   * @param {string} label - Event label/details
   */
  track(category, action, label = "") {
    // Check if tracking is enabled globally
    if (!this.config.enabled) {
      return;
    }

    // Check if this event type is enabled
    const eventTypeKey = this._getEventTypeKey(category);
    if (eventTypeKey && !this.config.events[eventTypeKey]) {
      return;
    }

    // Check if script URL is configured
    if (this.config.scriptUrl === "YOUR_GOOGLE_SCRIPT_URL_HERE") {
      if (this.config.debug) {
        console.warn(
          "[Analytics] Script URL not configured. Skipping tracking."
        );
      }
      return;
    }

    // Rate limiting: prevent spam
    const now = Date.now();
    if (now - this.lastEventTime < this.config.rateLimitMs) {
      if (this.config.debug) {
        console.warn("[Analytics] Rate limit exceeded. Skipping event:", {
          category,
          action,
          label,
        });
      }
      return;
    }
    this.lastEventTime = now;

    // Build event data
    const eventData = {
      timestamp: new Date().toISOString(),
      category,
      action,
      label,
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      referrer: document.referrer || "direct",
    };

    // Log event if debug mode
    if (this.config.debug) {
      console.log("[Analytics] Tracking event:", eventData);
    }

    // Send event
    this._sendEvent(eventData);
  }

  /**
   * Send event to Google Apps Script
   * @private
   */
  async _sendEvent(eventData) {
    try {
      // Check if online
      if (!navigator.onLine && this.config.queueOfflineEvents) {
        this.eventQueue.push(eventData);
        this.saveQueueToStorage();
        if (this.config.debug) {
          console.log("[Analytics] Offline. Event queued:", eventData);
        }
        return;
      }

      // Send to Google Apps Script
      const response = await fetch(this.config.scriptUrl, {
        method: "POST",
        mode: "no-cors", // Required for cross-origin requests to Google Scripts
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      // Note: no-cors mode doesn't allow reading response
      // We assume success if no error is thrown
      if (this.config.debug) {
        console.log("[Analytics] Event sent successfully");
      }

      // Clear retry count on success
      const eventKey = `${eventData.category}-${eventData.action}`;
      this.retryCount.delete(eventKey);
    } catch (error) {
      console.error("[Analytics] Failed to send event:", error);

      // Retry logic
      if (this.config.retryOnFail) {
        const eventKey = `${eventData.category}-${eventData.action}`;
        const retries = this.retryCount.get(eventKey) || 0;

        if (retries < this.config.maxRetries) {
          this.retryCount.set(eventKey, retries + 1);
          this.eventQueue.push(eventData);
          this.saveQueueToStorage();

          // Retry after delay
          setTimeout(() => this.processQueue(), 2000 * (retries + 1));

          if (this.config.debug) {
            console.log(
              `[Analytics] Will retry (${retries + 1}/${
                this.config.maxRetries
              })`
            );
          }
        } else {
          if (this.config.debug) {
            console.warn("[Analytics] Max retries reached. Dropping event.");
          }
          this.retryCount.delete(eventKey);
        }
      }
    }
  }

  /**
   * Process queued events
   * @private
   */
  async processQueue() {
    if (this.eventQueue.length === 0) return;

    if (this.config.debug) {
      console.log(
        `[Analytics] Processing ${this.eventQueue.length} queued events`
      );
    }

    const queue = [...this.eventQueue];
    this.eventQueue = [];
    this.saveQueueToStorage();

    for (const eventData of queue) {
      await this._sendEvent(eventData);
      // Small delay between events to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /**
   * Save event queue to localStorage
   * @private
   */
  saveQueueToStorage() {
    if (!this.config.queueOfflineEvents) return;

    try {
      localStorage.setItem(
        "bns-analytics-queue",
        JSON.stringify(this.eventQueue)
      );
    } catch (error) {
      console.error("[Analytics] Failed to save queue:", error);
    }
  }

  /**
   * Load event queue from localStorage
   * @private
   */
  loadQueueFromStorage() {
    if (!this.config.queueOfflineEvents) return;

    try {
      const stored = localStorage.getItem("bns-analytics-queue");
      if (stored) {
        this.eventQueue = JSON.parse(stored);
        if (this.config.debug && this.eventQueue.length > 0) {
          console.log(
            `[Analytics] Loaded ${this.eventQueue.length} queued events from storage`
          );
        }
      }
    } catch (error) {
      console.error("[Analytics] Failed to load queue:", error);
      this.eventQueue = [];
    }
  }

  /**
   * Get event type key from category
   * @private
   */
  _getEventTypeKey(category) {
    const mapping = {
      navigation: "navigation",
      button: "buttons",
      boss_timer: "bossTimer",
      sf_calculator: "sfCalculator",
      converter: "converter",
      header_control: "headerControls",
      promo: "promoSidebar",
      page: "pageLoad",
    };
    return mapping[category] || null;
  }
}

// Initialize global tracker instance
const analytics = new AnalyticsTracker(AnalyticsConfig);

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = analytics;
}
