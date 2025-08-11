// API Configuration for development and production
const API_CONFIG = {
  // Production API URL (your actual deployed backend)
  PRODUCTION_API_URL: import.meta.env.VITE_API_URL || 'https://finance-backend-iela.onrender.com/api',
  
  // Development API URL
  DEVELOPMENT_API_URL: 'http://localhost:3001/api'
};

// Determine which API URL to use based on environment
const getApiUrl = () => {
  // Check if we're in production (deployed)
  if (import.meta.env.PROD) {
    return API_CONFIG.PRODUCTION_API_URL;
  }
  
  // Check if custom API URL is provided via environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to development URL
  return API_CONFIG.DEVELOPMENT_API_URL;
};

export const API_URL = getApiUrl();

// Export for debugging
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: API_URL,
  mode: import.meta.env.MODE
};

console.log('🌐 API Configuration:', config);