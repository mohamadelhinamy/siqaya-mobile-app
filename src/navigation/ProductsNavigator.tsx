import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ProductsScreen, ProductDetailsScreen, CartScreen} from '../screens';

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetails: {productGuid: string};
  CartScreen: undefined;
};

const Stack = createStackNavigator<ProductsStackParamList>();

export const ProductsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProductsList" component={ProductsScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
};
