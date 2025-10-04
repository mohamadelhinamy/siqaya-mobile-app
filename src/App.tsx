import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {LanguageProvider, AuthProvider, QueryProvider} from './context';
import {AppNavigator} from './navigation';

// Import i18n configuration
import './services/i18n';

// Main App Component with providers and navigation
function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#1C1C1E' : '#F2F2F7'}
          />
          <AppNavigator />
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}

export default App;
