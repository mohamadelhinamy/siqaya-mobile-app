import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {I18nManager} from 'react-native';
import {useTranslation} from 'react-i18next';
import {SupportedLanguage, LanguageContextType, LanguageConfig} from '../types';
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
  const {i18n, t} = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    (i18n.language as SupportedLanguage) || 'en',
  );
  const [isRTL, setIsRTL] = useState<boolean>(
    RTL_LANGUAGES.includes(currentLanguage),
  );

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
      await i18n.changeLanguage(language);
      await storeLanguage(language);
      setCurrentLanguage(language);
      updateDirection(language);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Listen for language changes from i18n
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      const newLanguage = lng as SupportedLanguage;
      setCurrentLanguage(newLanguage);
      updateDirection(newLanguage);
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Set initial direction
    updateDirection(currentLanguage);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, currentLanguage]);

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
    textAlign: (isRTL ? 'right' : 'left') as 'left' | 'right',
    flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
    alignSelf: (isRTL ? 'flex-end' : 'flex-start') as 'flex-start' | 'flex-end',
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
