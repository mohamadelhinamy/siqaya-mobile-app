import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PhoneEntryScreen} from '../screens/auth/PhoneEntryScreen';
import {VerificationCodeScreen} from '../screens/auth/VerificationCodeScreen';
import {RegisterScreen} from '../screens/auth/RegisterScreen';

export type AuthStackParamList = {
  Login: undefined;
  PhoneEntry: undefined;
  VerificationCode: {
    phoneNumber: string;
    userId: number;
    otpExpiresIn: number;
  };
  Register: undefined;
  // ForgotPassword?: undefined; // Add when you create ForgotPasswordScreen
};

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="PhoneEntry"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#F2F2F7',
        },
      }}>
      <Stack.Screen
        name="PhoneEntry"
        component={PhoneEntryScreen}
        options={{
          title: 'Enter Phone Number',
        }}
      />

      <Stack.Screen
        name="VerificationCode"
        component={VerificationCodeScreen}
        options={{
          title: 'Verify Code',
        }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Sign Up',
        }}
      />

      {/* Add more auth screens here when created
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Reset Password',
        }}
      />
      */}
    </Stack.Navigator>
  );
};
