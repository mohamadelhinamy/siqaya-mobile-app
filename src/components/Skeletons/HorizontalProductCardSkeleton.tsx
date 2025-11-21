import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const HorizontalProductCardSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.imageContainer} />
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.title} />
            <View style={styles.category} />
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
            <View style={styles.progressText} />
          </View>
          <View style={styles.amountsContainer}>
            <View style={styles.amount} />
            <View style={styles.amount} />
          </View>
          <View style={styles.footer}>
            <View style={styles.location} />
            <View style={styles.buttonsContainer}>
              <View style={styles.button} />
              <View style={styles.buttonSmall} />
            </View>
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    minHeight: hp(22),
    maxHeight: hp(28),
    backgroundColor: '#fff',
    borderRadius: wp(3),
    overflow: 'hidden',
    marginBottom: hp(2),
  },
  imageContainer: {
    width: wp(40),
    height: '100%',
  },
  content: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'space-between',
  },
  header: {
    gap: hp(0.5),
  },
  title: {
    height: hp(2.5),
    borderRadius: 4,
    width: '80%',
  },
  category: {
    height: hp(2),
    borderRadius: 4,
    width: '50%',
  },
  progressContainer: {
    gap: hp(0.5),
    marginTop: hp(1),
  },
  progressBar: {
    height: hp(1),
    borderRadius: hp(0.5),
    width: '100%',
  },
  progressText: {
    height: hp(1.5),
    borderRadius: 4,
    width: '30%',
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1),
  },
  amount: {
    height: hp(2),
    borderRadius: 4,
    width: '45%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(1),
  },
  location: {
    height: hp(2),
    borderRadius: 4,
    width: '40%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: wp(2),
  },
  button: {
    height: hp(4.5),
    width: wp(20),
    borderRadius: wp(2),
  },
  buttonSmall: {
    height: hp(4.5),
    width: hp(4.5),
    borderRadius: wp(2),
  },
});

export default HorizontalProductCardSkeleton;
