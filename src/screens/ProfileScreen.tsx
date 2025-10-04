import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {Button, Card, Header} from '../components';

export const ProfileScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

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
      <Header title="Profile" subtitle="Manage your account" />

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Card title="User Information">
            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.label,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                Name:
              </Text>
              <Text
                style={[
                  styles.value,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                John Doe
              </Text>

              <Text
                style={[
                  styles.label,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                Email:
              </Text>
              <Text
                style={[
                  styles.value,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                john.doe@example.com
              </Text>

              <Text
                style={[
                  styles.label,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                Member since:
              </Text>
              <Text
                style={[
                  styles.value,
                  {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
                ]}>
                October 2025
              </Text>
            </View>
          </Card>

          <Card title="Actions">
            <View style={styles.buttonContainer}>
              <Button
                title="Edit Profile"
                onPress={handleEditProfile}
                variant="primary"
                style={styles.button}
              />
              <Button
                title="Settings"
                onPress={handleSettings}
                variant="outline"
                style={styles.button}
              />
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="secondary"
                style={styles.button}
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
