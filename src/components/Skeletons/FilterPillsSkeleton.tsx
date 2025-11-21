import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FilterPillsSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.pill} />
        <View style={styles.pill} />
        <View style={styles.pill} />
        <View style={styles.pill} />
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: wp(5),
    gap: wp(2),
    paddingVertical: hp(2),
  },
  pill: {
    height: hp(5),
    width: wp(25),
    borderRadius: wp(6),
  },
});

export default FilterPillsSkeleton;
