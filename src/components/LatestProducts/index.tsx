import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {Typography} from '../Typography';
import {ProductCard, ProductCardProps} from '../ProductCard';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';
import {apiService, Product} from '../../services/api';

interface LatestProductsProps {
  products?: ProductCardProps[];
  title?: string;
}

const getDefaultProducts = (_t: any): ProductCardProps[] => [
  {
    id: '1',
    title: 'بئر مياه جديد لمساعدة اخوتنا في قرية الغماس الجنوبية',
    raisedAmount: '10,215 ر.س',
    remainingAmount: '350,971 ر.س',
    progress: 0.2,
    category: 'آبار وعيون',
    location: 'الرياض',
    dealersCount: 5,
    image: require('../../assets/images/card_image.png'),
  },
  {
    id: '2',
    title: 'بئر مياه جديد لمساعدة اخوتنا في قرية الغماس الجنوبية',
    raisedAmount: '15,000 ر.س',
    remainingAmount: '285,000 ر.س',
    progress: 0.35,
    category: 'آبار وعيون',
    location: 'جدة',
    dealersCount: 8,
    image: require('../../assets/images/small_card_image.png'),
  },
];

export const LatestProducts: React.FC<LatestProductsProps> = ({
  products,
  title,
}) => {
  const {t} = useLanguage();
  const [fetchedProducts, setFetchedProducts] = useState<ProductCardProps[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayProducts =
    products || fetchedProducts.length > 0
      ? fetchedProducts
      : getDefaultProducts(t);

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

  useEffect(() => {
    if (products) {
      return; // Don't fetch if products are provided as props
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiService.getProducts(3, 1); // per_page=3, page=1
        if (response.data) {
          const mappedProducts = response.data.map(mapProductToCard);
          setFetchedProducts(mappedProducts);
        } else {
          setError('فشل في تحميل المنتجات');
        }
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError(err?.message || 'خطأ في الشبكة');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [products]);

  const containerStyle: ViewStyle = {
    ...styles.container,
    alignItems: 'flex-start',
  };

  const renderProductCard = (product: ProductCardProps) => {
    return <ProductCard key={product.id} {...product} />;
  };

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <Typography
          variant="h5"
          color="textPrimary"
          text={title ?? (t('products.latest') || 'أحدث المنتجات')}
          style={styles.sectionTitle}
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Typography
            variant="subtitle2"
            color="primary"
            text={t('products.viewAll') || 'عرض الكل'}
            style={styles.viewAllText}
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Typography
            variant="body2"
            color="textSecondary"
            text={error}
            style={styles.errorText}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          style={styles.scrollView}>
          {displayProducts.map(renderProductCard)}
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
    fontSize: wp(5),
    fontWeight: 'bold',
    color: Colors.text.primary,
  },
  viewAllText: {
    fontSize: wp(3.5),
    color: Colors.primary,
    fontWeight: '500',
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
  errorContainer: {
    height: hp(15),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
  },
  errorText: {
    textAlign: 'center',
  },
});
