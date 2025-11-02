import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const WaterDeliveryBannerSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.banner}>
          <View style={styles.leftContent}>
            <View style={styles.title} />
            <View style={styles.subtitle} />
            <View style={styles.button} />
          </View>
          <View style={styles.rightContent}>
            <View style={styles.image} />
          </View>
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
  },
  leftContent: {
    flex: 1,
    gap: 8,
  },
  title: {
    height: 20,
    width: '80%',
    borderRadius: 4,
  },
  subtitle: {
    height: 16,
    width: '60%',
    borderRadius: 4,
  },
  button: {
    height: 36,
    width: 100,
    borderRadius: 18,
    marginTop: 8,
  },
  rightContent: {
    width: 80,
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});

export default WaterDeliveryBannerSkeleton;
