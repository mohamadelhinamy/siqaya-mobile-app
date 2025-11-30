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
import {AddToCartModal} from '../components/AddToCartModal';
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
  const [sliders, setSliders] = React.useState<any[]>([]);
  const [cartModalVisible, setCartModalVisible] = React.useState(false);
  const [modalProductId, setModalProductId] = React.useState<number | null>(
    null,
  );
  const [modalProductName, setModalProductName] = React.useState<string>('');

  const handleCartPress = () => {
    navigation.navigate('CartScreen');
  };

  const handleProductPress = (productGuid: string) => {
    navigation.navigate('ProductDetails', {productGuid});
  };

  const handleOpenAddToCart = (
    productId: number,
    productGuid: string,
    title?: string,
  ) => {
    setModalProductId(productId);
    setModalProductName(title || '');
    setCartModalVisible(true);
  };

  const handleCloseAddToCart = () => {
    setCartModalVisible(false);
    setModalProductId(null);
    setModalProductName('');
  };

  const handleAddToCartSuccess = () => {
    // Optional: refresh homepage products or show a toast
    console.log('Added to cart from Home screen');
  };

  const fetchHomepageData = React.useCallback(async () => {
    try {
      setProductsLoading(true);
      console.log('🔄 Fetching homepage data...');
      const response = await apiService.get<HomepageProduct[]>(
        '/products/homepage',
      );
      // Fetch active sliders
      try {
        const slidersResp = await apiService.get<any>('/sliders/active');
        if (
          slidersResp &&
          slidersResp.success &&
          Array.isArray(slidersResp.data)
        ) {
          const mappedSlides = slidersResp.data.map((s: any) => ({
            id: String(s.id),
            image: s.images?.mobile
              ? {uri: s.images.mobile}
              : {uri: s.images?.web},
            title: s.title,
            summary: s.summary,
            button_text: s.button_text,
            link: s.link,
            link_type: s.link_type,
            link_target: s.link_target,
          }));
          setSliders(mappedSlides);
          console.log('✅ Fetched sliders:', mappedSlides.length);
        }
      } catch (err) {
        console.warn('Failed to fetch sliders:', err);
      }
      console.log(
        '✅ Homepage API Response:',
        JSON.stringify(response, null, 2),
      );

      if (response.success && response.data) {
        // Map homepage products to Product type
        console.log('🔄 Mapping homepage products...', response?.data);
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
          association: {
            id: product.association.id,
            name: product.association.name,
            logo: '',
          },
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
        ) : sliders && sliders.length > 0 ? (
          <HeroBanner
            slides={sliders}
            onPress={() => console.log('Hero banner pressed')}
          />
        ) : null}

        {/* Services Grid */}
        {loading ? <ServicesGridSkeleton /> : <ServicesGrid />}

        {/* Latest Products */}
        <LatestProducts
          apiProducts={homepageProducts.slice(0, 3)}
          loading={productsLoading}
          onProductPress={handleProductPress}
          onAddToCart={handleOpenAddToCart}
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
          onProductPress={handleProductPress}
          onAddToCart={handleOpenAddToCart}
        />

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      {/* Add to Cart Modal (opened from product cards) */}
      <AddToCartModal
        visible={cartModalVisible && modalProductId !== null}
        productId={modalProductId ?? 0}
        productName={modalProductName}
        onClose={handleCloseAddToCart}
        onSuccess={handleAddToCartSuccess}
      />
    </SafeAreaView>
  );
};

// Add modal outside the component return? Instead, we add it inside return near end —

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
