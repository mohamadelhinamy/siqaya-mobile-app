import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
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
import {apiService, Product} from '../services/api';
import {HomeStackParamList} from '../navigation/HomeNavigator';

interface HomepageProduct {
  id: number;
  guid: string;
  product_name: string;
  product_brief: string;
  target_amount: string;
  received_amount: string;
  collected_amount: number;
  remaining_amount: number;
  completion_percentage: number;
  association: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
    slug: string | null;
  };
  stage: {
    stage_target: number;
    stage_collected: number;
    stage_percentage: number;
  };
  image: string | null;
  created_at: string;
  updated_at: string;
}

type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

export const HomeScreen: React.FC = () => {
  const {t} = useLanguage();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [homepageProducts, setHomepageProducts] = React.useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = React.useState(false);

  const handleCartPress = () => {
    navigation.navigate('CartScreen');
  };

  const fetchHomepageData = React.useCallback(async () => {
    try {
      setProductsLoading(true);
      console.log('🔄 Fetching homepage data...');
      const response = await apiService.get<HomepageProduct[]>(
        '/products/homepage',
      );
      console.log(
        '✅ Homepage API Response:',
        JSON.stringify(response, null, 2),
      );

      if (response.success && response.data) {
        // Map homepage products to Product type
        const mappedProducts: Product[] = response.data.map(product => ({
          id: product.id,
          guid: product.guid || '',
          product_name: product.product_name,
          product_brief: product.product_brief,
          product_description: null,
          target_amount: product.target_amount,
          received_amount: product.received_amount,
          collected_amount: product.collected_amount,
          remaining_amount: product.remaining_amount,
          completion_percentage: product.completion_percentage,
          association: product.association,
          category: {
            ...product.category,
            slug: product.category.slug || '',
          },
          stage: product.stage,
          image: product.image,
          created_at: product.created_at || '',
          updated_at: product.updated_at || '',
        }));

        setHomepageProducts(mappedProducts);
        console.log('✅ Mapped homepage products:', mappedProducts.length);
      }
    } catch (error) {
      console.error('❌ Failed to fetch homepage data:', error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    // Fetch homepage data
    fetchHomepageData();

    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [fetchHomepageData]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Fetch homepage data on refresh
    await fetchHomepageData();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, [fetchHomepageData]);

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
        {loading ? (
          <HomeHeaderSkeleton />
        ) : (
          <HomeHeader onCartPress={handleCartPress} />
        )}

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
        <LatestProducts
          apiProducts={homepageProducts.slice(0, 3)}
          loading={productsLoading}
        />

        {/* Water Delivery Banner */}
        {loading ? (
          <WaterDeliveryBannerSkeleton />
        ) : (
          <WaterDeliveryBanner
            onPress={() => console.log('Water delivery pressed')}
          />
        )}

        <LatestProducts
          title={t('home.projectsNearCompletion')}
          apiProducts={homepageProducts
            .filter(p => p.stage.stage_percentage >= 80)
            .slice(0, 3)}
          loading={productsLoading}
        />

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
