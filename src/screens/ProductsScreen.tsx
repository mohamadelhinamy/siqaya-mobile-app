import React from 'react';
import {View, Text, StyleSheet, ScrollView, useColorScheme} from 'react-native';
import {useLanguage, useRTLStyles} from '../context';
import {Card} from '../components';

export const ProductsScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();
  const align = (rtlStyles.isRTL ? 'right' : 'left') as 'left' | 'right';

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
      color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
      marginBottom: 24,
      textAlign: align,
    },
    subtitle: {
      fontSize: 16,
      color: isDarkMode ? '#8E8E93' : '#8E8E93',
      marginBottom: 24,
      textAlign: align,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('navigation.products')}</Text>
        <Text style={styles.subtitle}>Browse our products and services</Text>

        <Card>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: isDarkMode ? '#FFFFFF' : '#1C1C1E',
              marginBottom: 8,
              textAlign: align,
            }}>
            Coming Soon
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: isDarkMode ? '#8E8E93' : '#8E8E93',
              textAlign: align,
            }}>
            Product catalog will be available here
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};
