// Common types used throughout the app

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NavigationProps {
  navigation: any; // Replace with proper navigation type when using React Navigation
  route: any;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    text: string;
    secondary: string;
  };
}

// Language and Internationalization types
export type SupportedLanguage = 'en' | 'ar';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  isRTL: boolean;
}

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  isRTL: boolean;
  availableLanguages: LanguageConfig[];
  changeLanguage: (language: SupportedLanguage) => Promise<void>;
  t: (key: string, options?: any) => string;
}

export interface TranslationResource {
  [key: string]: string | TranslationResource;
}
