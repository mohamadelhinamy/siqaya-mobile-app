import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {BottomTabNavigator} from './BottomTabNavigator';
import {AuthStackNavigator} from './AuthStackNavigator';
import {LoadingSpinner} from '../components';
import {useAuth} from '../context';
import {Fonts} from '../constants';

// Main app navigator that decides between auth flow and main app flow
export const AppNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const {isAuthenticated, isLoading} = useAuth();

  // Show loading screen while checking authentication state
  if (isLoading) {
    return <LoadingSpinner text="Loading..." />;
  }

  // Navigation theme for dark/light mode
  const navigationTheme = {
    dark: isDarkMode,
    colors: {
      primary: '#007AFF',
      background: isDarkMode ? '#1C1C1E' : '#F2F2F7',
      card: isDarkMode ? '#1C1C1E' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#1C1C1E',
      border: isDarkMode ? '#2C2C2E' : '#E5E5EA',
      notification: '#FF3B30',
    },
    fonts: {
      regular: {
        fontFamily: Fonts.regular,
        fontWeight: '400' as const,
      },
      medium: {
        fontFamily: Fonts.regular,
        fontWeight: '500' as const,
      },
      bold: {
        fontFamily: Fonts.bold,
        fontWeight: '700' as const,
      },
      heavy: {
        fontFamily: Fonts.bold,
        fontWeight: '900' as const,
      },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        // User is authenticated - show main app with bottom tabs
        <BottomTabNavigator />
      ) : (
        // User is not authenticated - show auth flow
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};
