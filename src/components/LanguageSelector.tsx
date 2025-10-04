import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useLanguage, useRTLStyles} from '../context';

export const LanguageSelector: React.FC = () => {
  const {currentLanguage, availableLanguages, changeLanguage, t} =
    useLanguage();
  const rtlStyles = useRTLStyles();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {textAlign: rtlStyles.textAlign}]}>
        {t('language.title')}
      </Text>

      <Text style={[styles.currentLanguage, {textAlign: rtlStyles.textAlign}]}>
        {t('language.current')}:{' '}
        {
          availableLanguages.find(lang => lang.code === currentLanguage)
            ?.nativeName
        }
      </Text>

      <View
        style={[
          styles.languageOptions,
          {flexDirection: rtlStyles.flexDirection},
        ]}>
        {availableLanguages.map(language => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLanguage === language.code && styles.activeButton,
            ]}
            onPress={() => changeLanguage(language.code)}>
            <Text
              style={[
                styles.languageButtonText,
                currentLanguage === language.code && styles.activeButtonText,
                {textAlign: 'center'},
              ]}>
              {language.nativeName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1C1C1E',
  },
  currentLanguage: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  languageOptions: {
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  languageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});
