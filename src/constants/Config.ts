// App configuration constants
export const Config = {
  APP_NAME: 'Siqaya Mobile App',
  VERSION: '1.0.0',

  // API Configuration
  API: {
    BASE_URL: __DEV__ ? 'http://localhost:3000/api' : 'https://api.siqaya.com',
    TIMEOUT: 10000,
  },

  // Screen dimensions and responsive breakpoints
  SCREEN: {
    SMALL_DEVICE_WIDTH: 375,
    MEDIUM_DEVICE_WIDTH: 768,
    LARGE_DEVICE_WIDTH: 1024,
  },

  // Animation durations
  ANIMATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
} as const;
