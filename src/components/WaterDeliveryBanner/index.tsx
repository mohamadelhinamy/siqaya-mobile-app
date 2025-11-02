import React from 'react';
import {View, StyleSheet, ImageBackground, ViewStyle} from 'react-native';

interface WaterDeliveryBannerProps {
  onPress?: () => void;
}

export const WaterDeliveryBanner: React.FC<WaterDeliveryBannerProps> = () => {
  const containerStyle: ViewStyle = {
    ...styles.container,
    alignItems: 'flex-start',
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../assets/images/bottom-banner.png')}
        style={containerStyle}
        imageStyle={styles.backgroundImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginVertical: 12,
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
  container: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backgroundImage: {
    borderRadius: 16,
  },
});
