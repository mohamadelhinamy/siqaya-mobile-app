import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';
import {apiService} from '../services/api';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';
const SKIP_LOGIN_KEY = 'skip_login';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  skipLogin: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  setSkipLogin: (skip: boolean) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [skipLogin, setSkipLoginState] = useState(false);

  // Check for existing authentication on app start
  useEffect(() => {
    checkAuthState();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthState = async () => {
    try {
      const [storedToken, storedUser, storedSkipLogin] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(AUTH_USER_KEY),
        AsyncStorage.getItem(SKIP_LOGIN_KEY),
      ]);

      // Check if user has skip login enabled
      if (storedSkipLogin === 'true') {
        setSkipLoginState(true);
      }

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      // Clear any corrupted data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = React.useCallback(async (authToken: string, userData: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, authToken),
        AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData)),
      ]);

      setToken(authToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      // Call the API logout if we have a token
      if (token) {
        try {
          await apiService.logout(token);
        } catch (apiError) {
          console.warn(
            'API logout failed, proceeding with local logout:',
            apiError,
          );
        }
      }

      await clearAuthData();
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setSkipLoginState(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }, [token]);

  const updateUser = React.useCallback(async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }, []);

  const setSkipLogin = React.useCallback(async (skip: boolean) => {
    try {
      await AsyncStorage.setItem(SKIP_LOGIN_KEY, skip.toString());
      setSkipLoginState(skip);
    } catch (error) {
      console.error('Error setting skip login:', error);
      throw error;
    }
  }, []);

  const clearAuthData = async () => {
    await Promise.all([
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
      AsyncStorage.removeItem(AUTH_USER_KEY),
      AsyncStorage.removeItem(SKIP_LOGIN_KEY),
    ]);
  };

  const contextValue = React.useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      token,
      skipLogin,
      login,
      logout,
      updateUser,
      setSkipLogin,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      token,
      skipLogin,
      login,
      logout,
      updateUser,
      setSkipLogin,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
