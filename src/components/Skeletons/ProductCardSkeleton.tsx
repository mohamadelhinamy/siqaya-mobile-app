import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const {width} = Dimensions.get('window');
const cardWidth = width * 0.4; // Matches ProductCard width

const ProductCardSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View style={styles.image} />
          <View style={styles.badge} />
        </View>
        <View style={styles.content}>
          <View style={styles.title} />
          <View style={styles.subtitle} />
          <View style={styles.tags}>
            <View style={styles.tag} />
            <View style={styles.tag} />
          </View>
          <View style={styles.priceContainer}>
            <View style={styles.price} />
            <View style={styles.button} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  image: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 50,
    height: 20,
    borderRadius: 10,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  title: {
    height: 16,
    borderRadius: 4,
    width: '80%',
  },
  subtitle: {
    height: 14,
    borderRadius: 4,
    width: '60%',
  },
  tags: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    height: 24,
    width: 60,
    borderRadius: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    height: 16,
    width: 60,
    borderRadius: 4,
  },
  button: {
    height: 32,
    width: 32,
    borderRadius: 16,
  },
});

export default ProductCardSkeleton;
