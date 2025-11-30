import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, CartScreen, ProductDetailsScreen} from '../screens';

export type HomeStackParamList = {
  HomeScreen: undefined;
  CartScreen: undefined;
  ProductDetails: {productGuid: string};
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
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};
