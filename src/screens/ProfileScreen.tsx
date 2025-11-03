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
import {useLanguage, useAuth} from '../context';

export const ProfileScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const {logout, user, isAuthenticated, skipLogin, setSkipLogin} = useAuth();

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

  const handleExitGuestMode = () => {
    Alert.alert(t('auth.guest.exitGuestMode'), t('auth.guest.exitMessage'), [
      {
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: t('auth.guest.signIn'),
        onPress: async () => {
          try {
            await setSkipLogin(false);
          } catch (error) {
            console.error('Error exiting guest mode:', error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}>
      <Header title={t('profile.title')} subtitle={t('profile.subtitle')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* User Information Card */}
        {isAuthenticated && user ? (
          <Card title={t('profile.userInfo.title')}>
            <View style={styles.userInfo}>
              <View>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  text={t('profile.userInfo.name')}
                  style={styles.label}
                />
                <Typography
                  variant="body1"
                  color="textPrimary"
                  text={user.name}
                  style={styles.value}
                />
              </View>
              <View>
                <Typography
                  variant="body2"
                  color="textPrimary"
                  text={t('profile.userInfo.email')}
                  style={styles.label}
                />
                <Typography
                  variant="body1"
                  color="textPrimary"
                  text={user.email}
                  style={styles.value}
                />
              </View>
            </View>
          </Card>
        ) : skipLogin ? (
          <Card title={t('auth.guest.mode')}>
            <View style={styles.userInfo}>
              <Typography
                variant="body1"
                color="textSecondary"
                text={t('auth.guest.message')}
                style={styles.value}
              />
            </View>
          </Card>
        ) : null}

        <Card title={t('profile.actions.title')}>
          <View style={styles.buttonContainer}>
            {isAuthenticated ? (
              <Button
                title={t('profile.actions.logout')}
                onPress={handleLogout}
                variant="secondary"
              />
            ) : skipLogin ? (
              <Button
                title={t('auth.guest.signIn')}
                onPress={handleExitGuestMode}
                variant="primary"
              />
            ) : null}
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
  lightContainer: {
    backgroundColor: '#F2F2F7',
  },
  darkContainer: {
    backgroundColor: '#000000',
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
