import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import EmptyCart from '../assets/icons/filled/empty-cart.svg';
import Trash from '../assets/icons/outlined/trash.svg';
import Gift from '../assets/icons/outlined/gift.svg';
import Riyal from '../assets/icons/outlined/riyal.svg';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {Colors} from '../constants';
import {useLanguage, useAuth} from '../context';
import {BackHeader, Typography, CustomButton} from '../components';
import {CartItemSkeleton} from '../components/Skeletons';
import {wp, hp} from '../utils/responsive';
import {apiService} from '../services/api';

export const CartScreen: React.FC = () => {
  const {t} = useLanguage();
  const navigation = useNavigation();
  const {token} = useAuth();
  const [cartData, setCartData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        console.log('❌ No user token available for cart fetch');
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
          setCartData([]);
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
        ) : !cartData || cartData.length === 0 ? (
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
                  navigation.navigate({
                    name: 'Products',
                  });
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
            {cartData?.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.productContainer,
                  index !== cartData.length - 1 && styles.productSeparator,
                ]}>
                {/* Product Image */}
                <View style={styles.productImage} />

                {/* Details Container */}
                <View style={styles.detailsContainer}>
                  {/* Top Row: Product Name + Trash Icon */}
                  <View style={styles.rowContainer}>
                    <Typography
                      variant="body1"
                      text={item.name}
                      color="textPrimary"
                      style={styles.name}
                    />
                    <Trash width={wp(5)} height={wp(5)} />
                  </View>

                  {/* Bottom Row: Donation Amount + Gift Icon Button */}
                  <View style={styles.rowContainer}>
                    <View style={styles.donationAmountContainer}>
                      <Typography
                        variant="body2"
                        text={item.amount}
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
});
