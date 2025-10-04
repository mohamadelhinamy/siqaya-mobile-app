import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {Button, Card, Header, LanguageSelector} from '../components';
import {useLanguage, useRTLStyles} from '../context';

export const ProfileScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();

  const handleEditProfile = () => {
    console.log('Edit Profile pressed!');
  };

  const handleSettings = () => {
    console.log('Settings pressed!');
  };

  const handleLogout = () => {
    console.log('Logout pressed!');
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#F2F2F7'},
      ]}>
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <ScrollView style={styles.scrollView}>
        <View
          style={[
            styles.content,
            {alignItems: rtlStyles.isRTL ? 'flex-end' : 'flex-start'},
          ]}>
          <Card title={t('profile.userInfo.title')}>
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.label,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.userInfo.name')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.sampleData.name')}
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.userInfo.email')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.sampleData.email')}
              </Text>

              <Text
                style={[
                  styles.label,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.userInfo.memberSince')}:
              </Text>
              <Text
                style={[
                  styles.value,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.sampleData.memberSince')}
              </Text>
            </View>
          </Card>

          <Card title={t('profile.actions.title')}>
            <View style={styles.buttonContainer}>
              <Button
                title={t('profile.actions.editProfile')}
                onPress={handleEditProfile}
                variant="primary"
                style={styles.button}
              />
              <Button
                title={t('profile.actions.settings')}
                onPress={handleSettings}
                variant="outline"
                style={styles.button}
              />
              <Button
                title={t('profile.actions.logout')}
                onPress={handleLogout}
                variant="secondary"
                style={styles.button}
              />
            </View>
          </Card>

          <LanguageSelector />
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
  userInfo: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
});
