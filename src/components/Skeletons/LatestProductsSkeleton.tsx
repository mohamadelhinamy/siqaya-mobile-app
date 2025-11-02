import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ProductCardSkeleton from './ProductCardSkeleton';

const LatestProductsSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder>
        <View style={styles.headerContainer}>
          <View style={styles.title} />
          <View style={styles.viewAll} />
        </View>
      </SkeletonPlaceholder>

      <View style={styles.productsContainer}>
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    height: 24,
    width: 120,
    borderRadius: 4,
  },
  viewAll: {
    height: 20,
    width: 80,
    borderRadius: 4,
  },
  productsContainer: {
    flexDirection: 'row',
    paddingLeft: 8,
    gap: 8,
  },
});

export default LatestProductsSkeleton;
