import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {HomeScreen, ProfileScreen} from './screens';
import {Button} from './components';
import {Colors} from './constants';
import {LanguageProvider, useLanguage, useRTLStyles} from './context';

// Import i18n configuration
import './services/i18n';

// Main App Content Component
const AppContent: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<'home' | 'profile'>(
    'home',
  );
  const {t, isRTL} = useLanguage();
  const rtlStyles = useRTLStyles();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      {renderScreen()}

      {/* Simple bottom navigation with RTL support */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            flexDirection: rtlStyles.flexDirection,
          },
        ]}>
        <Button
          title={t('navigation.home')}
          onPress={() => setCurrentScreen('home')}
          variant={currentScreen === 'home' ? 'primary' : 'outline'}
          style={styles.navButton}
        />
        <Button
          title={t('navigation.profile')}
          onPress={() => setCurrentScreen('profile')}
          variant={currentScreen === 'profile' ? 'primary' : 'outline'}
          style={styles.navButton}
        />
      </View>
    </SafeAreaView>
  );
};

// Main App Component with Language Provider
function App(): React.JSX.Element {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  navButton: {
    flex: 1,
  },
});

export default App;
