// Common types used throughout the app

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NavigationProps {
  navigation: any; // Replace with proper navigation type when using React Navigation
  route: any;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    background: string;
    text: string;
    secondary: string;
  };
}
