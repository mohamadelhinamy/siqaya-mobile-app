# Siqaya Mobile App

A React Native application with a well-organized folder structure and reusable components.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Custom button component
│   ├── Card.tsx        # Card container component
│   ├── Header.tsx      # Header component with navigation
│   ├── LoadingSpinner.tsx  # Loading indicator
│   └── index.ts        # Components barrel export
├── screens/            # Screen components
│   ├── HomeScreen.tsx  # Main home screen
│   ├── ProfileScreen.tsx   # User profile screen
│   └── index.ts        # Screens barrel export
├── constants/          # App constants
│   ├── Colors.ts       # Color palette
│   ├── Config.ts       # App configuration
│   └── index.ts        # Constants barrel export
├── types/              # TypeScript type definitions
│   └── index.ts        # Common types
├── utils/              # Utility functions
│   ├── helpers.ts      # Helper functions
│   └── index.ts        # Utils barrel export
├── services/           # API and external services
│   ├── api.ts          # Base API service
│   ├── user.ts         # User service
│   └── index.ts        # Services barrel export
└── App.tsx             # Main app component
```

## 🚀 Features

- ✅ **Organized Folder Structure**: Clean separation of concerns
- ✅ **Reusable Components**: Button, Card, Header, LoadingSpinner
- ✅ **TypeScript Support**: Full type safety throughout the app
- ✅ **Dark Mode Support**: Automatic theme switching
- ✅ **Sample Screens**: Home and Profile screens with navigation
- ✅ **API Service**: Ready-to-use HTTP client with error handling
- ✅ **Utility Functions**: Common helper functions
- ✅ **Constants Management**: Centralized colors and configuration

## 🧩 Components

### Button
A customizable button component with multiple variants:
- `primary` - Blue background button
- `secondary` - Gray background button  
- `outline` - Transparent with border

### Card
A container component with shadow and styling for content grouping.

### Header
A navigation header with title, subtitle, and optional left/right components.

### LoadingSpinner
An activity indicator with optional text for loading states.

## 📱 Screens

### HomeScreen
The main landing screen showcasing app features and quick actions.

### ProfileScreen
User profile management screen with user information display.

## 🔧 Services

### ApiService
Base HTTP client with methods for GET, POST, PUT, DELETE requests.

### UserService
User-specific API calls like profile management and avatar upload.

## 🎨 Styling

The app uses a consistent color palette defined in `src/constants/Colors.ts` with support for both light and dark modes.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Run tests
npm test

# Lint code
npm run lint
```

## 📦 Next Steps

You can now:
1. Add more screens to the `src/screens/` directory
2. Create additional reusable components in `src/components/`
3. Implement navigation using React Navigation
4. Add state management (Redux, Zustand, etc.)
5. Integrate with real APIs using the service layer
6. Add more utility functions as needed

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for all new files
3. Export components through index files
4. Maintain consistent styling patterns
5. Add proper type definitions