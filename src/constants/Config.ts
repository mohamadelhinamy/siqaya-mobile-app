// App configuration constants
export const Config = {
  APP_NAME: 'Siqaya Mobile App',
  VERSION: '1.0.0',

  // API Configuration
  API: {
    BASE_URL: 'https://sokya.ahmedanbar.dev/api/v1',
    TIMEOUT: 10000,
    // These should be moved to environment variables in production
    APP_KEY: 'app_ENaNAQqNhKAEh7hAdUvKTOX50g4APNw3RuOncGyEgoy2aaos', // Replace with actual app key
    APP_SECRET:
      '6efI2ZVr30b4MLkRlUsZi4IjnRmYdbSFWTtOgfk6vcileST62rsc8dBiEFjqTga6', // Replace with actual app secret
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
