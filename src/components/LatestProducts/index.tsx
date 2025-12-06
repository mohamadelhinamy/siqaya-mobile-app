import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
} from 'react-native';
import {Typography} from '../Typography';
import {ProductCard, ProductCardProps} from '../ProductCard';
import {BackIcon} from '../Icons';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';
import {Product} from '../../services/api';
import {LatestProductsSkeleton} from '../Skeletons';

interface LatestProductsProps {
  products?: ProductCardProps[];
  apiProducts?: Product[];
  loading?: boolean;
  title?: string;
  onProductPress?: (productId: string) => void;
  onAddToCart?: (
    productId: number,
    productGuid: string,
    title?: string,
  ) => void;
  onViewAll?: () => void;
}

// Map API Product to ProductCardProps
const mapProductToCard = (product: Product): ProductCardProps => {
  const progressPercent = product.stage?.stage_percentage || 0;
  const raised =
    product.stage?.stage_collected || Number(product.received_amount) || 0;
  const remaining =
    product.stage?.stage_remaining ||
    product.stage?.stage_target - (product.stage?.stage_collected || 0) ||
    Number(product.target_amount) - Number(product.received_amount) ||
    0;

  return {
    id: String(product.id),
    guid: product.guid,
    title: product.product_name || product.product_brief || '—',
    raisedAmount: `${raised.toLocaleString('ar-SA')} ر.س`,
    remainingAmount: `${remaining.toLocaleString('ar-SA')} ر.س`,
    progress: Math.max(0, Math.min(1, progressPercent / 100)),
    category: product.category?.name || '',
    location: product.association?.name || '',
    dealersCount: 0, // Not provided in API
    image: product.image || undefined,
  };
};

export const LatestProducts: React.FC<LatestProductsProps> = ({
  products,
  apiProducts,
  loading: externalLoading,
  title,
  onProductPress,
  onAddToCart,
  onViewAll,
}) => {
  const {t} = useLanguage();

  // If apiProducts are provided, map them to ProductCardProps
  const mappedApiProducts = React.useMemo(() => {
    if (apiProducts && apiProducts.length > 0) {
      return apiProducts.map(mapProductToCard);
    }
    return [];
  }, [apiProducts]);

  const displayProducts = products || mappedApiProducts;

  const isLoading = externalLoading || false;

  const containerStyle: ViewStyle = {
    ...styles.container,
    alignItems: 'flex-start',
  };

  const renderProductCard = (product: ProductCardProps) => {
    return (
      <ProductCard
        key={product.id}
        {...product}
        onPress={
          onProductPress ? () => onProductPress(product.guid) : undefined
        }
        onAddToCart={
          onAddToCart
            ? () => onAddToCart(Number(product.id), product.guid, product.title)
            : undefined
        }
      />
    );
  };

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <Typography
          variant="subtitle1"
          color="textPrimary"
          text={title ?? t('products.latest')}
          style={styles.sectionTitle}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.viewAllButton}
          onPress={onViewAll}>
          <Typography
            variant="subtitle2"
            color="primary"
            text={t('products.viewAll') || 'عرض الكل'}
            style={styles.viewAllText}
          />
          <View style={styles.backIconContainer}>
            <BackIcon width={wp(4)} height={wp(4)} color={Colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <LatestProductsSkeleton />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}>
          {apiProducts && apiProducts.length > 0
            ? apiProducts.map(p => renderProductCard(mapProductToCard(p)))
            : displayProducts.map(renderProductCard)}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: hp(2.5),
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  viewAllText: {
    fontSize: wp(3.5),
    color: Colors.primary,
    fontWeight: '500',
  },
  backIconContainer: {
    transform: [{scaleX: -1}], // Mirror on X-axis (horizontal flip)
  },
  scrollView: {
    paddingLeft: wp(4),
  },
  scrollContainer: {
    paddingLeft: wp(4),
    gap: wp(3),
  },
  loadingContainer: {
    height: hp(25),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
});
