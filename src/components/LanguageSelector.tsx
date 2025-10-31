import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {AppText} from './core/AppText';
import {useLanguage} from '../context';

export const LanguageSelector: React.FC = () => {
  const {currentLanguage, availableLanguages, changeLanguage, t, isRTL} =
    useLanguage();

  const titleAlignStyle = isRTL ? styles.textRight : styles.textLeft;
  const currentAlignStyle = isRTL ? styles.textRight : styles.textLeft;
  const rowDirStyle = isRTL ? styles.rowReverse : styles.row;

  return (
    <View style={styles.container}>
      <AppText bold style={[styles.title, titleAlignStyle]}>
        {t('language.title')}
      </AppText>

      <AppText style={[styles.currentLanguage, currentAlignStyle]}>
        {t('language.current')}:{' '}
        {
          availableLanguages.find(lang => lang.code === currentLanguage)
            ?.nativeName
        }
      </AppText>

      <View style={[styles.languageOptions, rowDirStyle]}>
        {availableLanguages.map(language => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageButton,
              currentLanguage === language.code && styles.activeButton,
            ]}
            onPress={() => changeLanguage(language.code)}>
            <AppText
              style={[
                styles.languageButtonText,
                currentLanguage === language.code && styles.activeButtonText,
              ]}>
              {language.nativeName}
            </AppText>
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
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textLeft: {
    textAlign: 'left',
  },
  textRight: {
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    color: '#1C1C1E',
    marginBottom: 12,
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
    color: '#007AFF',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
});
