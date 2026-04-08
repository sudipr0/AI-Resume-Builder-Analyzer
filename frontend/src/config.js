// frontend/src/config.js
const config = {
  // Use environment variable if available, otherwise fallback to localhost:5001
  apiUrl: import.meta.env.VITE_API_URL || '/api',

  // Production check
  isProduction: import.meta.env.PROD,

  // Feature flags
  features: {
    offlineMode: true,
    aiEnhancement: true,
    qrGeneration: true,
  }
};

export default config;
