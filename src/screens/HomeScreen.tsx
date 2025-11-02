import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {Colors} from '../constants';
import {HomeHeader} from '../components/HomeHeader';
import {SearchBar} from '../components/SearchBar';
import {HeroBanner} from '../components/HeroBanner';
import {ServicesGrid} from '../components/ServicesGrid';
import {LatestProducts} from '../components/LatestProducts';
import {WaterDeliveryBanner} from '../components/WaterDeliveryBanner';

export const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Components will be added step by step */}
        {/* Header with Logo and Cart */}
        <HomeHeader />

        {/* Search Bar */}
        <SearchBar />

        {/* Hero Banner */}
        <HeroBanner onPress={() => console.log('Hero banner pressed')} />

        {/* Services Grid */}
        <ServicesGrid />

        {/* Latest Products */}
        <LatestProducts />

        {/* Water Delivery Banner */}
        <WaterDeliveryBanner
          onPress={() => console.log('Water delivery pressed')}
        />

        <LatestProducts />

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  bottomSpacing: {
    height: 100, // Extra space for floating tab bar
  },
});
