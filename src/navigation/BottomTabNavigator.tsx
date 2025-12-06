import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from '../screens';
import {ProfileNavigator} from './ProfileNavigator';
import {CustomTabBar, DonationBottomSheet} from '../components';
import {HomeNavigator} from './HomeNavigator';
import {ProductsNavigator} from './ProductsNavigator';

export type BottomTabParamList = {
  Home: undefined;
  Products: undefined;
  Care: undefined;
  Paths: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const [donationModalVisible, setDonationModalVisible] = useState(false);

  const handleCenterButtonPress = React.useCallback(() => {
    setDonationModalVisible(true);
  }, []);

  const handleCloseDonation = React.useCallback(() => {
    setDonationModalVisible(false);
  }, []);

  const handleDonate = React.useCallback((amount: number, category: string) => {
    console.log('Donation:', {amount, category});
    // TODO: Implement donation logic here
  }, []);

  const renderTabBar = React.useCallback(
    (props: any) => (
      <CustomTabBar {...props} onCenterButtonPress={handleCenterButtonPress} />
    ),
    [handleCenterButtonPress],
  );

  return (
    <>
      <Tab.Navigator
        detachInactiveScreens={false} // 🔥🔥 FIX: force re-renders for tabBarStyle updates
        id={'BottomTabs' as any}
        tabBar={renderTabBar}
        screenOptions={{
          headerShown: false,
        }}>
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Products" component={ProductsNavigator} />
        <Tab.Screen name="Care" component={HomeScreen} />
        <Tab.Screen name="Paths" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileNavigator} />
      </Tab.Navigator>
      <DonationBottomSheet
        visible={donationModalVisible}
        onClose={handleCloseDonation}
        onDonate={handleDonate}
      />
    </>
  );
};
