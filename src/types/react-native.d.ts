// Augment React Native TextProps with a custom prop used by our font debug overlay
import 'react-native';

declare module 'react-native' {
  interface TextProps {
    allowFontFamily?: boolean;
  }
}
