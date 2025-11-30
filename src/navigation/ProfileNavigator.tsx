import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProfileScreen, CartScreen, SettingsScreen} from '../screens';
import ProfileDetailsScreen from '../screens/ProfileDetailsScreen';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  CartScreen: undefined;
  SettingsScreen: undefined;
  ProfileDetailsScreen: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen
        name="ProfileDetailsScreen"
        component={ProfileDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
