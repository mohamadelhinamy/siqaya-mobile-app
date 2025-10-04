import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Alert,
} from 'react-native';
import {Button, Card, Header, LanguageSelector} from '../components';
import {useLanguage, useRTLStyles, useAuth} from '../context';

export const SettingsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const {logout, user} = useAuth();

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
            Alert.alert(t('common.error'), 'Logout failed');
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7'},
      ]}>
      <Header
        title={t('navigation.settings')}
        subtitle="Manage your preferences"
      />

      <ScrollView style={styles.scrollView}>
        <View
          style={[
            styles.content,
            {alignItems: rtlStyles.isRTL ? 'flex-end' : 'flex-start'},
          ]}>
          <Card title="User Account">
            <View style={styles.userSection}>
              <Text
                style={[
                  styles.userInfo,
                  {
                    color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.userInfo.name')}: {user?.name}
              </Text>
              <Text
                style={[
                  styles.userInfo,
                  {
                    color: isDarkMode ? '#8E8E93' : '#8E8E93',
                    textAlign: rtlStyles.textAlign,
                  },
                ]}>
                {t('profile.userInfo.email')}: {user?.email}
              </Text>
            </View>
          </Card>

          <LanguageSelector />

          <Card title="Account Actions">
            <View style={styles.actionsContainer}>
              <Button
                title={t('auth.logout.title')}
                onPress={handleLogout}
                variant="secondary"
                style={styles.logoutButton}
              />
            </View>
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
  userSection: {
    gap: 8,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  logoutButton: {
    marginTop: 8,
  },
});
