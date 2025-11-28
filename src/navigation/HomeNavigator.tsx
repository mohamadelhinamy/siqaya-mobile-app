import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, CartScreen} from '../screens';

export type HomeStackParamList = {
  HomeScreen: undefined;
  CartScreen: undefined;
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
};
