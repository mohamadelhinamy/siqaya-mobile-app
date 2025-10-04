# Siqaya Mobile App 📱

A production-ready React Native application with comprehensive authentication, navigation, and internationalization features. Built with TypeScript and modern React Native practices.

## ✨ Features

### 🔐 Authentication System

- **Token-based authentication** with AsyncStorage persistence
- **Demo login functionality** for quick testing
- **Automatic navigation** between auth and main app flows
- **Persistent login state** across app restarts
- **Secure logout** with token cleanup

### 🧭 Navigation Architecture

- **React Navigation v7** with stack and tab navigation
- **Bottom Tab Navigator** with 3 main screens (Home, Profile, Settings)
- **Authentication Stack** for login flow
- **Auto-routing** based on authentication state
- **Dark/Light theme** support throughout navigation

### 🌍 Internationalization (i18n)

- **Multi-language support** (English & Arabic)
- **RTL/LTL layout support** with automatic app restart
- **Device language detection** on first launch
- **Persistent language selection** with AsyncStorage
- **Complete translation** coverage for all screens

### 🎨 Modern UI/UX

- **Dark mode support** with system theme detection
- **RTL-aware components** and layouts
- **Reusable component library** (Button, Card, Header, etc.)
- **Loading states** and error handling
- **Responsive design** for different screen sizes

### 🏗️ Architecture

- **Clean folder structure** with organized components
- **TypeScript** for type safety
- **Context API** for state management
- **Custom hooks** for reusable logic
- **Modular services** for API and utilities

## 🚀 Quick Start

### Prerequisites

Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) instructions.

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SiqayaMobileApp
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Install iOS dependencies**

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**

   ```bash
   yarn start
   ```

5. **Run the app**

   ```bash
   # iOS
   yarn ios
   # or
   npx react-native run-ios

   # Android
   yarn android
   # or
   npx react-native run-android
   ```

## 📱 App Flow

### Initial Launch

1. App checks for existing authentication token
2. If authenticated → Navigate to Bottom Tab Navigator
3. If not authenticated → Show Login Screen

### Authentication Flow

1. User enters credentials (or uses demo login)
2. Token and user data stored in AsyncStorage
3. App automatically navigates to main interface

### Language Switching

1. User selects language from Header or Settings
2. If RTL/LTR direction changes → App shows restart dialog
3. App restarts to apply layout direction changes

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Header.tsx
│   ├── LanguageSelector.tsx
│   └── LoadingSpinner.tsx
├── context/             # React Context providers
│   ├── AuthProvider.tsx      # Authentication state
│   ├── LanguageProvider.tsx  # i18n and RTL/LTR
│   └── index.ts
├── navigation/          # Navigation configuration
│   ├── AppNavigator.tsx      # Main navigation controller
│   ├── AuthStackNavigator.tsx # Login flow
│   ├── BottomTabNavigator.tsx # Main app tabs
│   └── index.ts
├── screens/             # Screen components
│   ├── auth/
│   │   └── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── SettingsScreen.tsx
│   └── index.ts
├── services/            # External services
│   ├── api.ts               # API calls
│   ├── i18n.ts             # Internationalization setup
│   └── user.ts             # User-related services
├── locales/             # Translation files
│   ├── en.json             # English translations
│   └── ar.json             # Arabic translations
├── constants/           # App constants
│   ├── Colors.ts
│   └── Config.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── helpers.ts
└── App.tsx              # Root component
```

## 🔧 Configuration

### Adding New Languages

1. **Add translation file**

   ```bash
   # Create new translation file
   touch src/locales/es.json
   ```

2. **Update i18n configuration**
   ```typescript
   // src/services/i18n.ts
   export const AVAILABLE_LANGUAGES: LanguageConfig[] = [
     {code: 'en', name: 'English', nativeName: 'English'},
     {code: 'ar', name: 'Arabic', nativeName: 'العربية'},
     {code: 'es', name: 'Spanish', nativeName: 'Español'}, // Add this
   ];
   ```

### Adding New Screens

1. **Create screen component**

   ```typescript
   // src/screens/NewScreen.tsx
   export const NewScreen: React.FC = () => {
     return (
       <View>
         <Text>New Screen</Text>
       </View>
     );
   };
   ```

2. **Add to navigation**

   ```typescript
   // src/navigation/BottomTabNavigator.tsx
   <Tab.Screen name="New" component={NewScreen} />
   ```

3. **Add translations**
   ```json
   // src/locales/en.json
   {
     "navigation": {
       "new": "New Screen"
     }
   }
   ```

## 🛠️ Development

### Testing Authentication

- Use "Demo Login" button for quick testing
- Or enter any email/password combination
- Check AsyncStorage for token persistence

### Testing Language Switching

1. Switch language from Home header or Settings
2. For RTL languages (Arabic), app will restart automatically
3. Test all screens to ensure proper RTL layout

### Debugging

- Use React Native Debugger for state inspection
- Check Metro bundler console for errors
- Use `console.log` statements in development

## 📦 Dependencies

### Core

- **React Native 0.75.2** - Mobile app framework
- **TypeScript** - Type safety
- **React Navigation 7.x** - Navigation system

### Authentication & Storage

- **@react-native-async-storage/async-storage** - Persistent storage
- **react-native-restart** - App restart functionality

### Internationalization

- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- **react-native-localize** - Device locale detection

### Navigation

- **@react-navigation/native** - Navigation core
- **@react-navigation/stack** - Stack navigation
- **@react-navigation/bottom-tabs** - Tab navigation
- **react-native-gesture-handler** - Gesture system
- **react-native-safe-area-context** - Safe area handling
- **react-native-screens** - Native screen optimization

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler not starting**

   ```bash
   yarn start --reset-cache
   ```

2. **iOS build fails**

   ```bash
   cd ios && pod install && cd ..
   ```

3. **Android build fails**

   ```bash
   cd android && ./gradlew clean && cd ..
   ```

4. **Language not switching**

   - Check if translations exist in locale files
   - Verify language code in AVAILABLE_LANGUAGES

5. **Navigation errors**
   - Ensure react-native-gesture-handler is imported in index.js
   - Check if all navigation dependencies are installed

### Performance Tips

- Use production builds for performance testing
- Enable Hermes engine for better performance
- Optimize images and assets
- Use lazy loading for screens when needed

## 📖 Additional Documentation

- [Navigation Guide](./NAVIGATION_GUIDE.md) - Detailed navigation architecture
- [React Native Docs](https://reactnative.dev) - Official documentation
- [React Navigation Docs](https://reactnavigation.org) - Navigation library docs
- [i18next Docs](https://www.i18next.com) - Internationalization docs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Add unit tests with Jest
- [ ] Implement push notifications
- [ ] Add biometric authentication
- [ ] Create user registration flow
- [ ] Add forgot password functionality
- [ ] Implement API integration
- [ ] Add image upload functionality
- [ ] Create onboarding screens

---

**Built with ❤️ using React Native and TypeScript**
