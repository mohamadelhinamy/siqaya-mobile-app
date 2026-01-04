import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  ProfileScreen,
  CartScreen,
  SettingsScreen,
  ProductDetailsScreen,
} from '../screens';
import ProfileDetailsScreen from '../screens/ProfileDetailsScreen';
import {MyDonationsScreen} from '../screens/MyDonationsScreen';
import {MyProductsScreen} from '../screens/MyProductsScreen';

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  CartScreen: undefined;
  SettingsScreen: undefined;
  ProfileDetailsScreen: undefined;
  DonationsScreen: undefined;
  MyProductsScreen: undefined;
  ProductDetails: {productGuid: string};
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
      <Stack.Screen name="DonationsScreen" component={MyDonationsScreen} />
      <Stack.Screen name="MyProductsScreen" component={MyProductsScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;
