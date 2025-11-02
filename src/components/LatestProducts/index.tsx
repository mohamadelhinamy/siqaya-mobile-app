import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {AppText} from '../core/AppText';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';

interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image?: any; // Changed to any to support require() syntax
  progress?: number;
  badge?: string;
  onPress?: () => void;
}

interface LatestProductsProps {
  products?: Product[];
}

const getDefaultProducts = (t: any): Product[] => [
  {
    id: '1',
    title: t('products.samples.waterWellTitle'),
    price: '10,215 ر.س',
    originalPrice: '350,971 ر.س',
    discount: '',
    progress: 0.2,
    badge: t('products.samples.wellsCategory'),
    image: require('../../assets/images/card_image.png'),
  },
  {
    id: '2',
    title: t('products.samples.waterWellTitleShort'),
    price: '10,215 ر.س',
    originalPrice: '',
    progress: 0.2,
    badge: t('products.samples.wellsCategory'),
    image: require('../../assets/images/small_card_image.png'),
  },
];

export const LatestProducts: React.FC<LatestProductsProps> = ({products}) => {
  const {isRTL, t} = useLanguage();
  const displayProducts = products || getDefaultProducts(t);

  const containerStyle: ViewStyle = {
    ...styles.container,
    alignItems: isRTL ? 'flex-end' : 'flex-start',
  };

  const sectionTitleStyle: TextStyle = {
    ...styles.sectionTitle,
    textAlign: isRTL ? 'right' : 'left',
  };

  const renderProductCard = (product: Product) => {
    const titleStyle: TextStyle = {
      ...styles.productTitle,
      textAlign: isRTL ? 'right' : 'left',
    };

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.productCard}
        onPress={product.onPress}
        activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          {product.image ? (
            <Image source={product.image} style={styles.productImage} />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <AppText style={styles.placeholderText}>🏺</AppText>
            </View>
          )}

          {product.badge && (
            <View style={styles.badge}>
              <AppText bold style={styles.badgeText}>
                {product.badge}
              </AppText>
            </View>
          )}

          {product.discount && (
            <View style={styles.discountBadge}>
              <AppText bold style={styles.discountText}>
                -{product.discount}
              </AppText>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <AppText style={titleStyle} numberOfLines={2}>
            {product.title}
          </AppText>

          <View style={styles.fundingInfo}>
            <AppText style={styles.raisedLabel}>{t('products.raised')}</AppText>
            <AppText bold style={styles.price}>
              {product.price}
            </AppText>
            {product.originalPrice && (
              <>
                <AppText style={styles.targetLabel}>
                  {t('products.remaining')}
                </AppText>
                <AppText style={styles.originalPrice}>
                  {product.originalPrice}
                </AppText>
              </>
            )}
          </View>

          {product.progress !== undefined && (
            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${product.progress * 100}%`},
                  ]}
                />
              </View>
              <AppText style={styles.progressText}>
                {Math.round(product.progress * 100)}% {t('products.completed')}
              </AppText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={containerStyle}>
      <View style={styles.header}>
        <AppText bold style={sectionTitleStyle}>
          {t('products.latest')}
        </AppText>
        <TouchableOpacity activeOpacity={0.7}>
          <AppText style={styles.viewAllText}>{t('products.viewAll')}</AppText>
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
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  scrollView: {
    paddingLeft: 16,
  },
  scrollContainer: {
    paddingRight: 16,
    gap: 12,
  },
  productCard: {
    width: 220,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
    lineHeight: 18,
  },
  fundingInfo: {
    marginBottom: 12,
  },
  raisedLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  targetLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  progressSection: {
    gap: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'center',
  },
});
