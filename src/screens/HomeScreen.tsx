import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {Button, Card, Header} from '../components';

export const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const handleWelcomePress = () => {
    console.log('Welcome button pressed!');
  };

  const handleGetStartedPress = () => {
    console.log('Get Started button pressed!');
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7'},
      ]}>
      <Header title="Siqaya Mobile App" subtitle="Welcome to your new app" />

      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Card title="Welcome">
            <Text
              style={[
                styles.text,
                {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
              ]}>
              This is your new React Native application with a proper folder
              structure. You can start building your features from here!
            </Text>
          </Card>

          <Card title="Quick Actions">
            <View style={styles.buttonContainer}>
              <Button
                title="Welcome"
                onPress={handleWelcomePress}
                variant="primary"
                style={styles.button}
              />
              <Button
                title="Get Started"
                onPress={handleGetStartedPress}
                variant="outline"
                style={styles.button}
              />
            </View>
          </Card>

          <Card title="Features">
            <Text
              style={[
                styles.text,
                {color: isDarkMode ? '#FFFFFF' : '#1C1C1E'},
              ]}>
              ✓ Organized folder structure{'\n'}✓ Reusable components{'\n'}✓
              TypeScript support{'\n'}✓ Dark mode support{'\n'}✓ Sample screens
              and navigation
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
});
