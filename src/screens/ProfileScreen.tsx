import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import {
  Button,
  Card,
  Header,
  LanguageSelector,
  Typography,
} from '../components';
import {useLanguage, useRTLStyles, useAuth} from '../context';

export const ProfileScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const {logout} = useAuth();

  const handleEditProfile = () => {
    console.log('Edit Profile pressed!');
  };

  const handleSettings = () => {
    console.log('Settings pressed!');
  };

  const handleLogout = () => {
    Alert.alert(t('auth.logout.title'), t('auth.logout.message'), [
      {
        text: t('auth.logout.cancel'),
        style: 'cancel',
      },
      {
        text: t('auth.logout.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#F2F2F7'},
      ]}>
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <Card title={t('profile.userInfo.title')}>
          <View style={styles.userInfo}>
            <Typography
              variant="body2"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.label, {textAlign: rtlStyles.textAlign}]}
              text={`${t('profile.userInfo.name')}:`}
            />
            <Typography
              variant="body1"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.value, {textAlign: rtlStyles.textAlign}]}
              text={t('profile.sampleData.name')}
            />

            <Typography
              variant="body2"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.label, {textAlign: rtlStyles.textAlign}]}
              text={`${t('profile.userInfo.email')}:`}
            />
            <Typography
              variant="body1"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.value, {textAlign: rtlStyles.textAlign}]}
              text={t('profile.sampleData.email')}
            />

            <Typography
              variant="body2"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.label, {textAlign: rtlStyles.textAlign}]}
              text={`${t('profile.userInfo.memberSince')}:`}
            />
            <Typography
              variant="body1"
              color={isDarkMode ? 'white' : 'text'}
              style={[styles.value, {textAlign: rtlStyles.textAlign}]}
              text={t('profile.sampleData.memberSince')}
            />
          </View>
        </Card>

        <Card title={t('profile.actions.title')}>
          <View style={styles.buttonContainer}>
            <Button
              title={t('profile.actions.editProfile')}
              onPress={handleEditProfile}
              variant="primary"
            />
            <Button
              title={t('profile.actions.settings')}
              onPress={handleSettings}
              variant="outline"
            />
            <Button
              title={t('profile.actions.logout')}
              onPress={handleLogout}
              variant="secondary"
            />
          </View>
        </Card>

        <LanguageSelector />
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
    flexGrow: 1,
    padding: 16,
    paddingBottom: 140, // Add extra padding at bottom to ensure buttons are visible above floating tab bar (70px height + 20px bottom + 50px extra)
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
    marginBottom: 16, // Add margin bottom to separate from language selector
  },
  button: {
    marginVertical: 4,
  },
});
