import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translation files
import en from '../locales/en.json';
import ar from '../locales/ar.json';

import {SupportedLanguage, LanguageConfig} from '../types';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Available languages configuration
export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    isRTL: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    isRTL: true,
  },
];

// Get RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = AVAILABLE_LANGUAGES.filter(
  lang => lang.isRTL,
).map(lang => lang.code);

// Detect device language
const detectDeviceLanguage = (): SupportedLanguage => {
  const locales = getLocales();
  const deviceLanguage = locales[0]?.languageCode;

  // Check if device language is supported
  const supportedLanguage = AVAILABLE_LANGUAGES.find(
    lang => lang.code === deviceLanguage,
  );

  return supportedLanguage ? (deviceLanguage as SupportedLanguage) : 'en';
};

// Get stored language or detect device language
const getInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (
      storedLanguage &&
      AVAILABLE_LANGUAGES.some(lang => lang.code === storedLanguage)
    ) {
      return storedLanguage as SupportedLanguage;
    }
  } catch (error) {
    console.warn('Error getting stored language:', error);
  }

  return detectDeviceLanguage();
};

// Store language preference
export const storeLanguage = async (
  language: SupportedLanguage,
): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Error storing language:', error);
  }
};

// Initialize i18n
i18n.use(initReactI18next).init({
  lng: 'ar', // Set Arabic as default language
  fallbackLng: 'ar',
  debug: __DEV__,

  resources: {
    en: {translation: en},
    ar: {translation: ar},
  },

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

// Don't auto-initialize language - let LanguageProvider handle it

export default i18n;
