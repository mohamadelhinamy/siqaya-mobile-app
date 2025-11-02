import React from 'react';
import {View, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {useLanguage, useRTLStyles} from '../context';
import {Card, Typography} from '../components';

export const CareScreen: React.FC = () => {
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
        <Typography
          variant="h1"
          style={styles.title}
          text={t('navigation.care')}
        />
        <Typography
          variant="body1"
          style={styles.subtitle}
          text="Healthcare services and support"
        />

        <Card>
          <Typography
            variant="h4"
            color={isDarkMode ? 'white' : 'text'}
            style={{
              marginBottom: 8,
              textAlign: rtlStyles.textAlign,
            }}
            text="Care Services"
          />
          <Typography
            variant="body2"
            color="textSecondary"
            style={{
              textAlign: rtlStyles.textAlign,
            }}
            text="Healthcare and support services will be available here"
          />
        </Card>
      </ScrollView>
    </View>
  );
};
