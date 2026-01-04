import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {PathsScreen, CartScreen} from '../screens';

export type PathsStackParamList = {
  PathsList: undefined;
  CartScreen: undefined;
};

const Stack = createStackNavigator<PathsStackParamList>();

export const PathsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="PathsList" component={PathsScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
    </Stack.Navigator>
  );
};
