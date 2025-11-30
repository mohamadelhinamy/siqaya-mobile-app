import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
  useFocusEffect,
} from '@react-navigation/native';
import {Colors} from '../constants';
import {
  ProductHeader,
  Typography,
  CustomButton,
  AddToCartModal,
} from '../components';
import {wp, hp} from '../utils/responsive';
import {apiService, Product} from '../services/api';
import {useLanguage} from '../context';
import EyeIcon from '../assets/icons/outlined/eye-icon.svg';
import ShoppingCartIcon from '../assets/icons/outlined/shopping-cart.svg';
import {
  ProfileTwoUsersIcon,
  LocationIcon,
  riyalIcon,
} from '../components/Icons/index';

type ProductDetailsRouteProp = RouteProp<
  {ProductDetails: {productGuid: string}},
  'ProductDetails'
>;

export const ProductDetailsScreen: React.FC = () => {
  const {t} = useLanguage();
  const navigation = useNavigation();
  const route = useRoute<ProductDetailsRouteProp>();
  const {productGuid} = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    console.log('Search pressed');
  };

  const handleOpenCartModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseCartModal = () => {
    setIsModalVisible(false);
  };

  const handleCartSuccess = () => {
    // Optionally refresh product data or navigate to cart
    console.log('Item added to cart successfully');
  };

  const handleCart = () => {
    console.log('Cart pressed');
    navigation.navigate('CartScreen' as never);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Fetching product details for GUID:', productGuid);
        const response = await apiService.get<Product>(
          `/products/${productGuid}`,
        );
        console.log('✅ Product details:', response);
        if (response.success && response.data) {
          console.log('✅ Setting product details', response.data);
          setProduct(response.data);
        } else {
          setError('Failed to load product details');
        }
      } catch (err) {
        console.error('❌ Failed to fetch product details:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productGuid]);

  useFocusEffect(
    useCallback(() => {
      const tabNav = navigation.getParent()?.getParent();

      tabNav?.setOptions({
        tabBarStyle: {display: 'none'},
      });

      return () => {
        tabNav?.setOptions({
          tabBarStyle: undefined,
        });
      };
    }, [navigation]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <ProductHeader
        onBackPress={handleBack}
        onSearchPress={handleSearch}
        onCartPress={handleCart}
        backgroundColor={Colors.white}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Typography
              variant="body1"
              text={error}
              color="error"
              style={styles.errorText}
            />
          </View>
        ) : product ? (
          <>
            {/* Hero Image Banner */}
            {product.image && (
              <Image
                source={{uri: product.image}}
                style={styles.heroImage}
                resizeMode="cover"
              />
            )}

            {/* Pill Tags */}
            <View style={styles.pillsContainer}>
              {product.category && (
                <View style={styles.pill}>
                  <Typography
                    variant="caption"
                    text={product.category.name}
                    color="textPrimary"
                    style={styles.pillText}
                  />
                </View>
              )}
              {product.association && (
                <View style={styles.secondaryPill}>
                  <Typography
                    variant="caption"
                    text={product.association.name}
                    color="textPrimary"
                    style={styles.secondaryPillText}
                  />
                </View>
              )}
            </View>
            {/* Product Title */}
            <View style={styles.content}>
              <Typography
                variant="h4"
                text={product.product_name || '—'}
                color="textPrimary"
                style={styles.productTitle}
              />

              {/* Organization Section */}
              {product.association && (
                <View style={styles.organizationSection}>
                  <View style={styles.organizationLogo}>
                    <Image
                      source={{uri: product.association.logo}}
                      style={styles.logoImage}
                      resizeMode="contain"
                    />
                  </View>
                  <Typography
                    variant="body2"
                    text={product.association.name}
                    color="textPrimary"
                    style={styles.organizationName}
                  />
                </View>
              )}

              <Typography
                variant="body2"
                text={product.product_brief || '—'}
                color="textPrimary"
                style={styles.productBrief}
              />

              {/* Funding Progress Section */}
              <View style={styles.fundingProgressSection}>
                {/* Funding Information - Side by Side */}
                <View style={styles.fundingContainer}>
                  <View style={styles.fundingColumn}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      text={t('products.raised')}
                      style={styles.fundingLabel}
                    />
                    <View style={styles.amountRow}>
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        text={Number(
                          product.stage.stage_collected,
                        ).toLocaleString('ar-SA')}
                        style={styles.raisedAmount}
                      />
                      {React.createElement(riyalIcon, {
                        width: wp(4),
                        height: wp(4),
                      })}
                    </View>
                  </View>

                  <View style={styles.fundingColumn}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      text={t('products.remaining')}
                      style={styles.fundingLabel}
                    />
                    <View style={styles.amountRow}>
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        text={Number(
                          product.stage.stage_target -
                            product.stage.stage_collected,
                        ).toLocaleString('ar-SA')}
                        style={styles.remainingAmount}
                      />
                      {React.createElement(riyalIcon, {
                        width: wp(4),
                        height: wp(4),
                      })}
                    </View>
                  </View>
                </View>

                {/* Progress Bar with Percentage Text on it */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {width: `${product.stage.stage_percentage}%`},
                      ]}>
                      <View style={styles.progressTextOverlay}>
                        <Typography
                          variant="caption"
                          color="white"
                          text={`${product.stage.stage_percentage}%`}
                          style={styles.progressText}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Statistics Section */}
              {product.summary && (
                <>
                  {/* Top Stats Row */}
                  <View style={styles.statsHeader}>
                    <View style={styles.statItem}>
                      <LocationIcon
                        width={wp(6)}
                        height={wp(6)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="body2"
                        text={
                          product.city?.name || product.province?.name || '—'
                        }
                        color="textPrimary"
                      />
                    </View>
                    <View style={styles.statItem}>
                      <ProfileTwoUsersIcon
                        width={wp(6)}
                        height={wp(6)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="body2"
                        text={t('products.details.beneficiariesCount', {
                          count: product.number_of_beneficiaries || 0,
                        })}
                        color="textPrimary"
                      />
                    </View>
                  </View>

                  {/* Statistics Cards Grid */}
                  <View style={styles.statsGrid}>
                    {/* Beneficiaries Card */}
                    <View style={styles.statCard}>
                      <EyeIcon
                        width={wp(8)}
                        height={wp(8)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="h5"
                        text={String(product.number_of_beneficiaries) || '0'}
                        color="primary"
                        style={styles.statValue}
                      />
                      <Typography
                        variant="body2"
                        text={t('products.details.beneficiaries')}
                        color="textSecondary"
                      />
                    </View>

                    {/* Total Donations Card */}
                    <View style={styles.statCard}>
                      <EyeIcon
                        width={wp(8)}
                        height={wp(8)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="h5"
                        text={String(product.summary.donations_count)}
                        color="primary"
                        style={styles.statValue}
                      />
                      <Typography
                        variant="body2"
                        text={t('products.details.totalDonations')}
                        color="textSecondary"
                      />
                    </View>

                    {/* Views Card */}
                    <View style={styles.statCard}>
                      <EyeIcon
                        width={wp(8)}
                        height={wp(8)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="h5"
                        text={String(product.summary.views_count)}
                        color="primary"
                        style={styles.statValue}
                      />
                      <Typography
                        variant="body2"
                        text={t('products.details.views')}
                        color="textSecondary"
                      />
                    </View>

                    {/* Last Donation Card */}
                    <View style={styles.statCard}>
                      <EyeIcon
                        width={wp(8)}
                        height={wp(8)}
                        color={Colors.primary}
                      />
                      <Typography
                        variant="h5"
                        text={product.summary.last_donation_human || '13 ثانية'}
                        color="primary"
                        style={styles.statValue}
                      />
                      <Typography
                        variant="body2"
                        text={t('products.details.lastDonation')}
                        color="textSecondary"
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>

      {/* Bottom Action Buttons */}
      {product && (
        <View style={styles.bottomActionButtons}>
          <CustomButton
            variant="icon"
            icon={<ShoppingCartIcon color={Colors.text.primary} />}
            iconLabel={t('products.addToCart')}
            onPress={handleOpenCartModal}
            style={styles.cartButton}
          />
          <CustomButton
            title={t('products.donateNow')}
            variant="primary"
            onPress={() => console.log('Donate pressed')}
            style={styles.donateButton}
          />
        </View>
      )}

      {/* Add to Cart Modal */}
      {product && (
        <AddToCartModal
          visible={isModalVisible}
          productId={product.id}
          productName={product.product_brief || product.product_name}
          onClose={handleCloseCartModal}
          onSuccess={handleCartSuccess}
        />
      )}
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
  heroImage: {
    width: wp(100),
    height: hp(25),
    backgroundColor: Colors.gray[200],
  },
  pillsContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    gap: wp(2),
  },
  pill: {
    backgroundColor: Colors.text.turquoise,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
  },
  pillText: {
    fontSize: wp(3.2),
    color: Colors.white,
  },
  secondaryPill: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
  },
  secondaryPillText: {
    fontSize: wp(3.2),
    color: Colors.text.primary,
  },
  content: {
    padding: wp(4),
    paddingTop: 0,
  },
  organizationSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: wp(3),
  },
  organizationLogo: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(6),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lighter,
  },
  logoImage: {
    width: wp(10),
    height: wp(10),
  },
  organizationName: {},
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(2),
    paddingHorizontal: wp(2),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: wp(3),
    marginTop: hp(2),
  },
  statCard: {
    width: wp(44),
    backgroundColor: Colors.white,
    borderRadius: wp(4),
    borderWidth: 1,
    borderColor: Colors.text.turquoise,
    padding: wp(4),
    alignItems: 'center',
    gap: hp(0.5),
    marginTop: hp(1),
  },
  statValue: {
    marginVertical: hp(0.5),
    textAlign: 'left',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  errorText: {
    textAlign: 'center',
  },
  productTitle: {
    marginBottom: hp(2),
    textAlign: 'left',
    fontWeight: 'bold',
  },
  productBrief: {
    textAlign: 'left',
    marginTop: hp(2),
  },
  fundingProgressSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: wp(3),
    padding: wp(3),
    marginTop: hp(2),
    marginBottom: hp(2),
    width: wp(90),
    alignSelf: 'center',
  },
  fundingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1.5),
  },
  fundingColumn: {
    alignItems: 'center',
  },
  fundingLabel: {
    fontSize: wp(3),
    color: Colors.text.secondary,
    marginBottom: hp(0.5),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  raisedAmount: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  remainingAmount: {
    fontWeight: 'bold',
    fontSize: wp(4),
    color: Colors.text.primary,
  },
  progressBarContainer: {
    position: 'relative',
  },
  progressBar: {
    height: hp(2.5),
    backgroundColor: '#E5E5E5',
    borderRadius: wp(3),
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#03A9F4',
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
  },
  progressText: {
    fontSize: wp(3),
    fontWeight: '600',
    marginBottom: 0,
  },
  bottomActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  donateButton: {
    flex: 1,
    borderRadius: wp(6),
    margin: 0,
    marginBottom: 0,
  },
  cartButton: {
    flex: 1,
    borderRadius: wp(6),
    margin: 0,
    marginBottom: 0,
  },
});
