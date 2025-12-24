import React from 'react';
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  StyleSheet,
  View,
  Linking,
  Alert,
  Platform,
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
import {ProductDonationModal} from '../components/ProductDonationModal';
import {DonationBottomSheet} from '../components/DonationBottomSheet';
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
  const [completedProducts, setCompletedProducts] = React.useState<Product[]>(
    [],
  );
  const [productsLoading, setProductsLoading] = React.useState(false);
  const [sliders, setSliders] = React.useState<any[]>([]);
  const [cartModalVisible, setCartModalVisible] = React.useState(false);
  const [donationModalVisible, setDonationModalVisible] = React.useState(false);
  const [publicDonationVisible, setPublicDonationVisible] =
    React.useState(false);
  const [modalProductId, setModalProductId] = React.useState<number | null>(
    null,
  );
  const [modalProductName, setModalProductName] = React.useState<string>('');
  const [modalProductGuid, setModalProductGuid] = React.useState<string>('');

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
    setModalProductGuid(productGuid);
    setModalProductName(title || '');
    setCartModalVisible(true);
  };

  const handleCloseAddToCart = () => {
    setCartModalVisible(false);
    setModalProductId(null);
    setModalProductGuid('');
    setModalProductName('');
  };

  const handleAddToCartSuccess = () => {
    // Optional: refresh homepage products or show a toast
    console.log('Added to cart from Home screen');
  };

  const handleOpenDonation = (
    productId: number,
    productGuid: string,
    title?: string,
  ) => {
    setModalProductId(productId);
    setModalProductGuid(productGuid);
    setModalProductName(title || '');
    setDonationModalVisible(true);
  };

  const handleCloseDonation = () => {
    setDonationModalVisible(false);
    setModalProductId(null);
    setModalProductGuid('');
    setModalProductName('');
  };

  const handleDonationSuccess = () => {
    console.log('Donation completed from Home screen');
  };

  const handleSliderPress = (slide?: any) => {
    if (!slide?.action_type) {
      console.log('Hero banner pressed - no action');
      return;
    }

    console.log('Slider action:', slide.action_type, slide);

    switch (slide.action_type) {
      case 'navigate_in_app':
        if (slide.mobile_navigation_component?.value === 'publicDonation') {
          // Open public donation bottom sheet
          setPublicDonationVisible(true);
        } else if (
          slide.mobile_navigation_component?.value === 'ProductDonation'
        ) {
          // Navigate to product details with attribute_value as product GUID
          if (slide.attribute_value) {
            navigation.navigate('ProductDetails', {
              productGuid: slide.attribute_value,
            });
          }
        }
        break;

      case 'send_sms':
        // Open SMS app with pre-filled number and message
        if (slide.sms_phone_number && slide.sms_message) {
          const smsUrl = `sms:${slide.sms_phone_number}${
            Platform.OS === 'ios' ? '&' : '?'
          }body=${encodeURIComponent(slide.sms_message)}`;
          Linking.canOpenURL(smsUrl)
            .then(supported => {
              if (supported) {
                Linking.openURL(smsUrl);
              } else {
                Alert.alert(
                  t('common.error'),
                  'SMS app is not available on this device',
                );
              }
            })
            .catch(err => console.error('Error opening SMS app:', err));
        }
        break;

      case 'navigate_to_web':
        // Open browser with the provided link
        if (slide.link) {
          Linking.canOpenURL(slide.link)
            .then(supported => {
              if (supported) {
                Linking.openURL(slide.link);
              } else {
                Alert.alert(t('common.error'), 'Cannot open URL');
              }
            })
            .catch(err => console.error('Error opening URL:', err));
        }
        break;

      default:
        console.log('Unknown action type:', slide.action_type);
    }
  };

  const fetchHomepageData = React.useCallback(async () => {
    try {
      setProductsLoading(true);
      console.log('🔄 Fetching homepage data...');

      // Fetch homepage products
      const response = await apiService.get<any>('/products/homepage');

      // Fetch active sliders separately
      try {
        const slidersResp = await apiService.get<any>('/sliders');
        if (
          slidersResp &&
          slidersResp.success &&
          Array.isArray(slidersResp.data)
        ) {
          console.log('🔄 Mapping sliders...', slidersResp.data);
          const mappedSlides = slidersResp.data.map((s: any) => ({
            id: String(s.id),
            image: {uri: s.image},
            title: s.title,
            summary: s.summary,
            button_text: s.button_text,
            link: s.link,
            link_type: s.link_type,
            link_target: s.link_target,
            action_type: s.action_type,
            mobile_navigation_component: s.mobile_navigation_component,
            attribute_value: s.attribute_value,
            sms_phone_number: s.sms_phone_number,
            sms_message: s.sms_message,
          }));
          setSliders(mappedSlides);
          console.log('✅ Fetched sliders:', mappedSlides.length);
        }
      } catch (err) {
        console.warn('Failed to fetch sliders:', err);
      }

      if (response.success && response.data) {
        const homepageData = response.data.homepage || [];
        const nearlyCompletedData = response.data.nearlyCompleted || [];
        console.log('🔄 Mapping homepage products...', homepageData.length);
        console.log(
          '🔄 Mapping nearly completed products...',
          nearlyCompletedData.length,
        );

        const mappedHomepage: Product[] = homepageData.map((product: any) => ({
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

        const mappedNearlyCompleted: Product[] = nearlyCompletedData.map(
          (product: any) => ({
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
          }),
        );

        setHomepageProducts(mappedHomepage);
        setCompletedProducts(mappedNearlyCompleted);
        console.log('✅ Mapped homepage products:', mappedHomepage.length);
        console.log(
          '✅ Mapped nearly completed products:',
          mappedNearlyCompleted.length,
        );
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

        {/* Hero Banner */}
        {loading ? (
          <HeroBannerSkeleton />
        ) : sliders && sliders.length > 0 ? (
          <HeroBanner slides={sliders} onPress={handleSliderPress} />
        ) : null}

        {/* Services Grid */}
        {loading ? <ServicesGridSkeleton /> : <ServicesGrid />}

        {/* Latest Products */}
        <LatestProducts
          apiProducts={homepageProducts.slice(0, 3)}
          loading={productsLoading}
          onProductPress={handleProductPress}
          onAddToCart={handleOpenAddToCart}
          onDonate={handleOpenDonation}
          onViewAll={() =>
            navigation.navigate('ProductListScreen', {
              products: homepageProducts,
              title: t('products.latest'),
            })
          }
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
          apiProducts={completedProducts.slice(0, 3)}
          loading={productsLoading}
          onProductPress={handleProductPress}
          onAddToCart={handleOpenAddToCart}
          onDonate={handleOpenDonation}
          onViewAll={() =>
            navigation.navigate('ProductListScreen', {
              products: completedProducts,
              title: t('home.projectsNearCompletion'),
            })
          }
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
      {/* Product Donation Modal */}
      <ProductDonationModal
        visible={donationModalVisible}
        productId={modalProductId ?? 0}
        productGuid={modalProductGuid}
        productName={modalProductName}
        onClose={handleCloseDonation}
        onSuccess={handleDonationSuccess}
      />
      {/* Public Donation Bottom Sheet */}
      <DonationBottomSheet
        visible={publicDonationVisible}
        onClose={() => setPublicDonationVisible(false)}
        onDonate={(amount, category) => {
          console.log('Public donation:', {amount, category});
          setPublicDonationVisible(false);
        }}
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
