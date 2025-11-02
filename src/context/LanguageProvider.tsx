import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {useTranslation} from 'react-i18next';
import {SupportedLanguage, LanguageContextType} from '../types';
import {
  AVAILABLE_LANGUAGES,
  RTL_LANGUAGES,
  storeLanguage,
} from '../services/i18n';

interface LanguageProviderProps {
  children: ReactNode;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// Language Provider Component
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const {i18n, t, ready} = useTranslation();
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>('ar');
  const [isRTL, setIsRTL] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Update RTL direction when language changes
  const updateDirection = (language: SupportedLanguage) => {
    const shouldBeRTL = RTL_LANGUAGES.includes(language);
    setIsRTL(shouldBeRTL);

    // Force RTL/LTR for React Native
    if (I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
    }
  };

  // Change language function
  const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
    try {
      const rtl = RTL_LANGUAGES.includes(language);
      const LANGUAGE_STORAGE_KEY = 'app_language';

      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      await storeLanguage(language);
      setCurrentLanguage(language);
      setIsRTL(rtl);

      // Always change the language first
      await i18n.changeLanguage(language);

      // Then update RTL direction if needed, and restart
      if (I18nManager.isRTL !== rtl) {
        I18nManager.allowRTL(rtl);
        I18nManager.forceRTL(rtl);
        setTimeout(() => {
          RNRestart.restart();
        }, 200);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Initialize language from AsyncStorage on first launch
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        const LANGUAGE_STORAGE_KEY = 'app_language';
        const savedLanguage =
          ((await AsyncStorage.getItem(
            LANGUAGE_STORAGE_KEY,
          )) as SupportedLanguage) || 'ar';
        const savedRTL = RTL_LANGUAGES.includes(savedLanguage);

        console.log(
          'Initializing - Saved language:',
          savedLanguage,
          'Should be RTL:',
          savedRTL,
          'Current RTL:',
          I18nManager.isRTL,
        );

        // Check if there's a direction mismatch that requires restart
        if (I18nManager.isRTL !== savedRTL) {
          console.log(
            'RTL direction mismatch detected! Restarting app to fix layout...',
          );

          // Set correct RTL direction
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(savedRTL);

          // Force restart to apply RTL changes
          setTimeout(() => {
            RNRestart.restart();
          }, 100);
          return; // Don't continue initialization, restart will handle it
        }

        // No mismatch, continue normal initialization
        setCurrentLanguage(savedLanguage);
        setIsRTL(savedRTL);

        // Ensure RTL is allowed
        I18nManager.allowRTL(true);

        await i18n.changeLanguage(savedLanguage);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing language:', error);
        setIsInitialized(true);
      }
    };

    initializeLanguage();
  }, [i18n]);

  // Listen for language changes from i18n
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLanguage = lng as SupportedLanguage;
      setCurrentLanguage(newLanguage);
      updateDirection(newLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Don't render children until i18n is ready and language is initialized
  if (!ready || !isInitialized) {
    return null;
  }

  // Context value
  const contextValue: LanguageContextType = {
    currentLanguage,
    isRTL,
    availableLanguages: AVAILABLE_LANGUAGES,
    changeLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Helper hook for RTL-aware styles
export const useRTLStyles = () => {
  const {isRTL} = useLanguage();

  return {
    isRTL,
    textAlign: isRTL ? ('right' as const) : ('left' as const),
    flexDirection: isRTL ? ('row' as const) : ('row' as const),
    alignSelf: isRTL ? ('flex-end' as const) : ('flex-start' as const),
    marginLeft: (value: number) =>
      isRTL ? {marginRight: value} : {marginLeft: value},
    marginRight: (value: number) =>
      isRTL ? {marginLeft: value} : {marginRight: value},
    paddingLeft: (value: number) =>
      isRTL ? {paddingRight: value} : {paddingLeft: value},
    paddingRight: (value: number) =>
      isRTL ? {paddingLeft: value} : {paddingRight: value},
  };
};
