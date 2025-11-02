/**
 * @format
 */

import 'react-native-gesture-handler';
import {AppRegistry, I18nManager} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

// Set default RTL direction for Arabic (app default)
// This ensures proper layout on very first launch
I18nManager.allowRTL(true);
if (!I18nManager.isRTL) {
  I18nManager.forceRTL(true);
}

AppRegistry.registerComponent(appName, () => App);
