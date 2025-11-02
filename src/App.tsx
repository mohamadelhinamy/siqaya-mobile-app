import React from 'react';
import {
  StatusBar,
  useColorScheme,
  Text,
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import {LanguageProvider, AuthProvider, QueryProvider} from './context';
import {AppNavigator} from './navigation';
import {Fonts} from './constants';

// Import i18n configuration
import './services/i18n';

// Enforce global app font (normal by default, bold when requested)
const DEFAULT_FONT = Fonts.regular;
const BOLD_FONT = Fonts.bold;

const coerceArray = (v: any) => (Array.isArray(v) ? v : v ? [v] : []);
const isBoldWeight = (w?: string | number) => {
  if (!w) {
    return false;
  }
  if (typeof w === 'number') {
    return w >= 600;
  }
  const lw = String(w).toLowerCase();
  return (
    lw === 'bold' ||
    lw === '600' ||
    lw === '700' ||
    lw === '800' ||
    lw === '900'
  );
};

// Patch Text.render to apply our font everywhere
// Keep all incoming styles but strip fontWeight/fontFamily to avoid iOS falling back to system fonts
// Then apply bold family when a bold weight is requested
// Note: this runs before any component renders
const originalTextRender = (Text as any).render;
(Text as any).render = function patchedTextRender(...args: any[]) {
  const origin = (originalTextRender as any).apply(this, args);
  const flat = StyleSheet.flatten(coerceArray(origin?.props?.style));
  // Allow opt-out for debugging: when allowFontFamily is true, do not override or strip
  if (origin?.props?.allowFontFamily === true) {
    const sanitized = {...(flat || {})} as any;
    // keep provided fontFamily and weights intact
    return React.cloneElement(origin, {style: sanitized});
  }
  const family = DEFAULT_FONT;
  const sanitized = {...(flat || {})} as any;
  // Keep fontWeight so iOS can pick the bold face within the 'Juman' family
  delete sanitized.fontFamily;
  const mergedStyle = [{fontFamily: family}, sanitized];
  return React.cloneElement(origin, {style: mergedStyle});
};

// Patch TextInput similarly (default to normal family)
const originalTextInputRender = (TextInput as any).render;
if (typeof originalTextInputRender === 'function') {
  (TextInput as any).render = function patchedTextInputRender(...args: any[]) {
    const origin = originalTextInputRender.apply(this, args);
    const flat = StyleSheet.flatten(coerceArray(origin?.props?.style));
    const sanitized = {...(flat || {})} as any;
    delete sanitized.fontFamily;
    const mergedStyle = [{fontFamily: DEFAULT_FONT}, sanitized];
    return React.cloneElement(origin, {style: mergedStyle});
  };
}

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
