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
import {useLanguage} from '../../context';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';

interface LatestProductsProps {
  products?: ProductCardProps[];
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

export const LatestProducts: React.FC<LatestProductsProps> = ({products}) => {
  const {t} = useLanguage();
  const displayProducts = products || getDefaultProducts(t);

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
          text={t('products.latest') || 'أحدث المنتجات'}
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollView}>
        {displayProducts.map(renderProductCard)}
      </ScrollView>
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
    paddingRight: wp(4),
    gap: wp(3),
  },
});
