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
import {useLanguage} from '../context';
import {HomeHeader} from '../components/HomeHeader';
import {SearchBar} from '../components/SearchBar';
import {HeroBanner} from '../components/HeroBanner';
import {ServicesGrid} from '../components/ServicesGrid';
import {LatestProducts} from '../components/LatestProducts';
import {WaterDeliveryBanner} from '../components/WaterDeliveryBanner';
import {
  HomeHeaderSkeleton,
  SearchBarSkeleton,
  HeroBannerSkeleton,
  ServicesGridSkeleton,
  WaterDeliveryBannerSkeleton,
} from '../components/Skeletons';

export const HomeScreen: React.FC = () => {
  const {t} = useLanguage();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
        {/* Header with Logo and Cart */}
        {loading ? <HomeHeaderSkeleton /> : <HomeHeader />}

        {/* Search Bar */}
        {loading ? <SearchBarSkeleton /> : <SearchBar />}

        {/* Hero Banner */}
        {loading ? (
          <HeroBannerSkeleton />
        ) : (
          <HeroBanner onPress={() => console.log('Hero banner pressed')} />
        )}

        {/* Services Grid */}
        {loading ? <ServicesGridSkeleton /> : <ServicesGrid />}

        {/* Latest Products */}
        <LatestProducts />

        {/* Water Delivery Banner */}
        {loading ? (
          <WaterDeliveryBannerSkeleton />
        ) : (
          <WaterDeliveryBanner
            onPress={() => console.log('Water delivery pressed')}
          />
        )}

        <LatestProducts title={t('home.projectsNearCompletion')} />

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
