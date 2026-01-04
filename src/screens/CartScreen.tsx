import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import EmptyCart from '../assets/icons/filled/empty-cart.svg';
import Trash from '../assets/icons/outlined/trash.svg';
import Gift from '../assets/icons/outlined/gift.svg';
import Riyal from '../assets/icons/outlined/riyal.svg';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Colors} from '../constants';
import {useLanguage, useAuth} from '../context';
import {
  BackHeader,
  Typography,
  CustomButton,
  PaymentWebView,
} from '../components';
import {CartItemSkeleton} from '../components/Skeletons';
import {wp, hp} from '../utils/responsive';
import {apiService, CartData, CartItem} from '../services/api';
import {paymentService} from '../services/payment';

export const CartScreen: React.FC = () => {
  const {t} = useLanguage();
  const navigation = useNavigation();
  const {token} = useAuth();
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        console.log('❌ No user token available for cart fetch');
        // Ensure loader stops when there's no authenticated user
        setCartData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('🔑 USER TOKEN FOR TESTING:', token);

        // Small delay to ensure app token is fully initialized
        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await apiService.getCart(token);
        console.log('🛒 Cart fetch response:', response);
        if (response.success && response.data) {
          setCartData(response.data);
        } else {
          console.log('⚠️ Cart fetch failed:', response.error);
          setCartData(null);
        }
      } catch (error) {
        console.error('❌ Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!token) {
      Alert.alert(
        'Login required',
        'Please sign in to remove items from cart.',
      );
      return;
    }

    Alert.alert(
      t('cart.removeConfirmTitle') || 'Remove item',
      t('cart.removeConfirm') ||
        'Are you sure you want to remove this item from your cart?',
      [
        {text: t('common.cancel') || 'Cancel', style: 'cancel'},
        {
          text: t('common.ok') || 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const delResp = await apiService.delete(`/cart/items/${itemId}`, {
                Authorization: `Bearer ${token}`,
              });
              console.log('Delete item response:', delResp);

              // Refresh cart after deletion
              const refreshed = await apiService.getCart(token);
              if (refreshed.success && refreshed.data) {
                setCartData(refreshed.data);
              } else {
                setCartData(null);
              }
            } catch (error) {
              console.error('Failed to delete cart item:', error);
              Alert.alert('Error', 'Failed to remove item. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  const handleCheckout = async () => {
    if (!cartData || !cartData.total_amount) {
      return;
    }

    setCheckingOut(true);

    try {
      const response = await paymentService.initiatePayment(
        {
          amount: Number(cartData.total_amount),
          order_type: 'cart',
          payment_method: 'visa', // Default to visa for now
        },
        token || undefined,
      );

      if (response.success && response.webview_url) {
        // Open payment webview
        setPaymentUrl(response.webview_url);
      } else {
        Alert.alert(t('common.error'), response.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(t('common.error'), 'Failed to process checkout');
    } finally {
      setCheckingOut(false);
    }
  };

  // safe debug: avoid indexing into undefined
  console.log(cartData?.items?.[0]?.product, 'cartData');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <BackHeader onBackPress={handleBack} title={t('cart.title')} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.productsContainer}>
            {[1, 2, 3].map(index => (
              <CartItemSkeleton key={index} />
            ))}
          </View>
        ) : !cartData || (cartData.items?.length ?? 0) === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyCart width={wp(10)} height={wp(10)} />
            <Typography
              variant="body1"
              text={t('cart.empty')}
              color="textPrimary"
              style={styles.emptyCartText}
            />
            <View style={styles.ctaWrapper}>
              <CustomButton
                title={t('cart.continueShopping')}
                onPress={() => {
                  navigation.goBack();
                  // Navigation types are broad in this workspace; use a safe-any cast
                  (navigation as any).navigate('Products');
                }}
                variant="primary"
                size="large"
                fullWidth={false}
                style={styles.donateButton}
              />
            </View>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            {cartData?.items?.map((item: CartItem, index: number) => (
              <View
                key={item.id}
                style={[
                  styles.productContainer,
                  index !== (cartData.items?.length ?? 0) - 1 &&
                    styles.productSeparator,
                ]}>
                {/* Product Image */}
                {item.product?.image ? (
                  <Image
                    source={{uri: item.product.image}}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.productImage,
                      styles.productImagePlaceholder,
                    ]}
                  />
                )}

                {/* Details Container */}
                <View style={styles.detailsContainer}>
                  {/* Top Row: Product Name + Trash Icon */}
                  <View style={styles.rowContainer}>
                    <Typography
                      variant="body1"
                      text={item.product?.product_name || t('products.unknown')}
                      color="textPrimary"
                      style={styles.name}
                    />
                    <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                      <Trash width={wp(5)} height={wp(5)} />
                    </TouchableOpacity>
                  </View>

                  {/* Bottom Row: Donation Amount + Gift Icon Button */}
                  <View style={styles.rowContainer}>
                    <View style={styles.donationAmountContainer}>
                      <Typography
                        variant="body2"
                        text={String(item.amount ?? item.quantity ?? '')}
                        color="textSecondary"
                        style={styles.donationAmount}
                      />
                      <Riyal width={wp(4)} height={wp(4)} />
                    </View>
                    <View style={styles.giftIconButton}>
                      <Gift width={wp(5)} height={wp(5)} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer: show total and donate button when cart has items */}
      {!loading && cartData && (cartData.items?.length ?? 0) > 0 && (
        <View style={styles.footerContainer}>
          <View style={styles.totalRow}>
            <Typography
              variant="body1"
              text={t('cart.total')}
              color="textSecondary"
            />
            <View style={styles.totalAmountWrapper}>
              <Typography
                variant="h2"
                text={Number(cartData.total_amount).toLocaleString()}
                color="textPrimary"
                style={styles.totalAmount}
              />
              <Riyal width={wp(6)} height={wp(6)} />
            </View>
          </View>

          <View style={styles.footerButtonWrapper}>
            <CustomButton
              title={t('cart.checkout')}
              onPress={handleCheckout}
              variant="primary"
              size="large"
              fullWidth={true}
              loading={checkingOut}
              disabled={checkingOut}
            />
          </View>
        </View>
      )}

      {/* Payment WebView */}
      <PaymentWebView
        visible={!!paymentUrl}
        url={paymentUrl}
        onClose={() => {
          setPaymentUrl('');
          setCheckingOut(false);
        }}
        onSuccess={() => {
          setPaymentUrl('');
          setCheckingOut(false);
          // Refresh cart after successful payment
          fetchCart();
          Alert.alert(t('common.success'), 'Payment completed successfully');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lighter,
  },
  backButton: {
    padding: wp(2),
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  placeholder: {
    width: wp(10),
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(20),
    gap: hp(1),
  },
  emptyCartText: {
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: hp(3),
  },
  ctaWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  donateButton: {
    width: wp(80),
    marginBottom: 0, // override CustomButton default margin
  },
  productsContainer: {
    backgroundColor: Colors.white,
    padding: wp(2),
    borderRadius: wp(2),
    width: wp(90),
    alignSelf: 'center',
    marginTop: hp(2),
  },
  productContainer: {
    width: wp(85),
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  productSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lighter,
  },
  productImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
    backgroundColor: Colors.light,
  },
  productImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: hp(3),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '500',
  },
  giftIconButton: {
    padding: wp(2),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.light,
  },
  donationAmountContainer: {
    width: wp(40),
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: Colors.light,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  donationAmount: {
    marginBottom: 0,
  },
  footerContainer: {
    padding: wp(4),
    paddingBottom: 0,
    backgroundColor: Colors.background.light,
    borderTopWidth: 1,
    borderTopColor: Colors.lighter,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  totalAmountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  totalAmount: {
    fontWeight: '700',
  },
  footerButtonWrapper: {
    width: '100%',
  },
});
