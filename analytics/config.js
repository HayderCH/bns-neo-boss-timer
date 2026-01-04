// ============================================
// Analytics Configuration
// ============================================

const AnalyticsConfig = {
  // Google Apps Script endpoint URL
  // Replace with your deployed script URL after setup
  scriptUrl:
    "https://script.google.com/macros/s/AKfycbzm_RZqUAQuB_YQQHKTuzVx5sqCIAdCQfE9GEeYrmWB_2YszvSah42STzY0W3ydE_gFPg/exec",

  // Enable/disable tracking globally
  enabled: true,

  // Rate limiting: max events per second per user
  rateLimitMs: 1000,

  // Retry failed requests
  retryOnFail: true,
  maxRetries: 3,

  // Queue events when offline (send when back online)
  queueOfflineEvents: true,

  // Debug mode (logs to console)
  debug: false,

  // Events to track (set to false to disable specific events)
  events: {
    navigation: true, // Tab clicks, region switches
    buttons: true, // All button clicks
    bossTimer: true, // Boss card interactions
    sfCalculator: true, // SF Calculator usage
    converter: true, // Probability converter usage
    headerControls: true, // Theme, notifications, export
    promoSidebar: true, // Promo box clicks
    pageLoad: true, // Initial page load
  },
};

// Export for use in tracker
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnalyticsConfig;
}
