import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  ProductsScreen,
  CareScreen,
  PathsScreen,
  ProfileScreen,
} from '../screens';
import {CustomTabBar} from '../components';
import {HomeNavigator} from './HomeNavigator';

export type BottomTabParamList = {
  Home: undefined;
  Products: undefined;
  Care: undefined;
  Paths: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const CustomTabBarComponent = (props: any) => <CustomTabBar {...props} />;

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      detachInactiveScreens={false} // 🔥🔥 FIX: force re-renders for tabBarStyle updates
      id={'BottomTabs' as any}
      tabBar={CustomTabBarComponent}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeNavigator} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Care" component={HomeScreen} />
      <Tab.Screen name="Paths" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
