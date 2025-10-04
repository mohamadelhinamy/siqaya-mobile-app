import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {Button, Card, Header} from '../components';
import {useLanguage, useRTLStyles} from '../context';

export const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t, changeLanguage, currentLanguage} = useLanguage();
  const rtlStyles = useRTLStyles();

  const handleWelcomePress = () => {
    console.log('Welcome button pressed!');
  };

  const handleGetStartedPress = () => {
    console.log('Get Started button pressed!');
  };

  const handleLanguageSwitch = () => {
    const newLanguage = currentLanguage === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7'},
      ]}>
      <Header
        title={t('home.title')}
        subtitle={t('home.subtitle')}
        rightComponent={
          <Button
            title={t('language.switch')}
            onPress={handleLanguageSwitch}
            variant="outline"
            style={styles.languageButton}
          />
        }
      />

      <ScrollView
        style={[
          styles.scrollView,
          {direction: rtlStyles.isRTL ? 'rtl' : 'ltr'},
        ]}
        contentInsetAdjustmentBehavior="automatic">
        <View
          style={[
            styles.content,
            {alignItems: rtlStyles.isRTL ? 'flex-end' : 'flex-start'},
          ]}>
          <Card title={t('home.welcomeCard.title')}>
            <Text
              style={[
                styles.text,
                {
                  color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                  textAlign: rtlStyles.textAlign,
                },
              ]}>
              {t('home.welcomeCard.description')}
            </Text>
          </Card>

          <Card title={t('home.quickActions.title')}>
            <View style={styles.buttonContainer}>
              <Button
                title={t('home.quickActions.welcome')}
                onPress={handleWelcomePress}
                variant="primary"
                style={styles.button}
              />
              <Button
                title={t('home.quickActions.getStarted')}
                onPress={handleGetStartedPress}
                variant="outline"
                style={styles.button}
              />
            </View>
          </Card>

          <Card title={t('home.features.title')}>
            <Text
              style={[
                styles.text,
                {
                  color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                  textAlign: rtlStyles.textAlign,
                },
              ]}>
              ✓ {t('home.features.organizedStructure')}
              {'\n'}✓ {t('home.features.reusableComponents')}
              {'\n'}✓ {t('home.features.typescriptSupport')}
              {'\n'}✓ {t('home.features.darkModeSupport')}
              {'\n'}✓ {t('home.features.sampleScreens')}
              {'\n'}✓ {t('home.features.multiLanguage')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 36,
  },
});
