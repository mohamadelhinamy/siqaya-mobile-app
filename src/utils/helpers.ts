import {Dimensions, Platform} from 'react-native';

/**
 * Get device dimensions
 */
export const getDeviceDimensions = () => {
  const {width, height} = Dimensions.get('window');
  return {
    width,
    height,
    isSmallDevice: width < 375,
    isMediumDevice: width >= 375 && width < 768,
    isLargeDevice: width >= 768,
  };
};

/**
 * Format date to readable string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Check if running on iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Check if running on Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Generate a simple random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
