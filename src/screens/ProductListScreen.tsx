import React from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {HorizontalProductCard, BackHeader} from '../components';
import {AddToCartModal} from '../components/AddToCartModal';
import {ProductDonationModal} from '../components/ProductDonationModal';
import {Colors} from '../constants';
import {wp, hp} from '../utils/responsive';
import {Product} from '../services/api';
import {HomeStackParamList} from '../navigation/HomeNavigator';

type ProductListScreenRouteProp = RouteProp<
  HomeStackParamList,
  'ProductListScreen'
>;

type ProductListScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'ProductListScreen'
>;

export const ProductListScreen: React.FC = () => {
  const route = useRoute<ProductListScreenRouteProp>();
  const navigation = useNavigation<ProductListScreenNavigationProp>();
  const {products, title} = route.params;

  const [cartModalVisible, setCartModalVisible] = React.useState(false);
  const [modalProductId, setModalProductId] = React.useState<number | null>(
    null,
  );
  const [modalProductName, setModalProductName] = React.useState<string>('');
  const [modalProductGuid, setModalProductGuid] = React.useState<string>('');
  const [donationModalVisible, setDonationModalVisible] = React.useState(false);

  const handleProductPress = (productGuid: string) => {
    navigation.navigate('ProductDetails', {productGuid});
  };

  const handleOpenAddToCart = (
    productId: number,
    productGuid: string,
    productTitle?: string,
  ) => {
    setModalProductId(productId);
    setModalProductGuid(productGuid);
    setModalProductName(productTitle || '');
    setCartModalVisible(true);
  };

  const handleCloseAddToCart = () => {
    setCartModalVisible(false);
    setModalProductId(null);
    setModalProductGuid('');
    setModalProductName('');
  };

  const handleAddToCartSuccess = () => {
    console.log('✅ Product added to cart successfully');
  };

  const handleOpenDonation = (
    productId: number,
    productGuid: string,
    productTitle?: string,
  ) => {
    setModalProductId(productId);
    setModalProductGuid(productGuid);
    setModalProductName(productTitle || '');
    setDonationModalVisible(true);
  };

  const handleCloseDonation = () => {
    setDonationModalVisible(false);
    setModalProductId(null);
    setModalProductGuid('');
    setModalProductName('');
  };

  const handleDonationSuccess = () => {
    console.log('✅ Donation completed successfully');
  };

  const renderProduct = ({item}: {item: Product}) => {
    const raised = item.stage?.stage_collected || 0;
    const remaining =
      item.stage?.stage_remaining ||
      (item.stage?.stage_target ? item.stage.stage_target - raised : 0);

    return (
      <View style={styles.productContainer}>
        <HorizontalProductCard
          id={String(item.id)}
          title={item.product_name || item.product_brief || '—'}
          category={item.category?.name || ''}
          location={item.association?.name || ''}
          dealersCount={0}
          raisedAmount={raised.toString()}
          remainingAmount={remaining.toString()}
          progress={Math.max(
            0,
            Math.min(1, (item.stage?.stage_percentage || 0) / 100),
          )}
          image={item.image ? {uri: item.image} : undefined}
          onPress={() => handleProductPress(item.guid)}
          onAddToCart={() =>
            handleOpenAddToCart(item.id, item.guid, item.product_name || '')
          }
          onDonate={() =>
            handleOpenDonation(item.id, item.guid, item.product_name || '')
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title={title} backgroundColor={Colors.white} />

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.guid}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Add to Cart Modal */}
      <AddToCartModal
        visible={cartModalVisible && modalProductId !== null}
        productId={modalProductId ?? 0}
        productName={modalProductName}
        onClose={handleCloseAddToCart}
        onSuccess={handleAddToCartSuccess}
      />

      {/* Product Donation Modal */}
      <ProductDonationModal
        visible={donationModalVisible && modalProductId !== null}
        productId={modalProductId ?? 0}
        productGuid={modalProductGuid}
        productName={modalProductName}
        onClose={handleCloseDonation}
        onSuccess={handleDonationSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    padding: wp(4),
    paddingBottom: hp(10),
  },
  productContainer: {
    marginBottom: hp(2),
  },
});
