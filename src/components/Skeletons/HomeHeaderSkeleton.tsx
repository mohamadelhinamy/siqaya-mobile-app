import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const HomeHeaderSkeleton: React.FC = () => {
  return (
    <SkeletonPlaceholder>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View style={styles.greeting} />
          <View style={styles.username} />
        </View>
        <View style={styles.rightSection}>
          <View style={styles.icon} />
          <View style={styles.icon} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  leftSection: {
    gap: 4,
  },
  greeting: {
    height: 16,
    width: 80,
    borderRadius: 4,
  },
  username: {
    height: 20,
    width: 120,
    borderRadius: 4,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
});

export default HomeHeaderSkeleton;
