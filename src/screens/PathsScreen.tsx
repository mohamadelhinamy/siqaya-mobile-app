import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {useLanguage, useRTLStyles} from '../context';
import {Card} from '../components';

export const PathsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#1C1C1E' : '#F2F2F7',
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
      marginBottom: 24,
      textAlign: rtlStyles.textAlign,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#8E8E93' : '#8E8E93',
      marginBottom: 24,
      textAlign: rtlStyles.textAlign,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('navigation.paths')}</Text>
        <Text style={styles.subtitle}>Learning paths and programs</Text>

        <Card>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
              marginBottom: 8,
              textAlign: rtlStyles.textAlign,
            }}>
            Learning Paths
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isDarkMode ? '#8E8E93' : '#8E8E93',
              textAlign: rtlStyles.textAlign,
            }}>
            Educational content and learning paths will be available here
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};
