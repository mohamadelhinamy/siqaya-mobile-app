import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {wp, hp} from '../../utils/responsive';

const CartItemSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        {/* Product Image */}
        <View style={styles.image} />

        {/* Details Container */}
        <View style={styles.details}>
          {/* Top Row: Product Name */}
          <View style={styles.topRow}>
            <View style={styles.name} />
            <View style={styles.icon} />
          </View>

          {/* Bottom Row: Amount Container */}
          <View style={styles.bottomRow}>
            <View style={styles.amountContainer} />
            <View style={styles.iconButton} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    width: wp(85),
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(3),
  },
  image: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(2),
  },
  details: {
    flex: 1,
    gap: hp(2),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    width: wp(40),
    height: hp(2),
    borderRadius: 4,
  },
  icon: {
    width: wp(5),
    height: wp(5),
    borderRadius: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amountContainer: {
    width: wp(40),
    height: hp(4),
    borderRadius: wp(2),
  },
  iconButton: {
    width: wp(9),
    height: hp(4),
    borderRadius: wp(2),
  },
});

export default CartItemSkeleton;
