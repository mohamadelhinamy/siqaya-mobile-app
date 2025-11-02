import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {AppText} from '../core/AppText';
import {useLanguage} from '../../context';
import {Colors} from '../../constants';

interface WaterDeliveryBannerProps {
  onPress?: () => void;
}

export const WaterDeliveryBanner: React.FC<WaterDeliveryBannerProps> = ({
  onPress,
}) => {
  const {isRTL, t} = useLanguage();

  const containerStyle: ViewStyle = {
    ...styles.container,
    alignItems: isRTL ? 'flex-end' : 'flex-start',
  };

  const titleStyle: TextStyle = {
    ...styles.title,
    textAlign: isRTL ? 'right' : 'left',
  };

  const subtitleStyle: TextStyle = {
    ...styles.subtitle,
    textAlign: isRTL ? 'right' : 'left',
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require('../../assets/images/hero.png')}
        style={containerStyle}
        imageStyle={styles.backgroundImage}>
        <View style={styles.overlay} />

        <View style={styles.textContainer}>
          <AppText bold style={titleStyle}>
            {t('waterDelivery.title')}
          </AppText>
          <AppText style={subtitleStyle}>
            {t('waterDelivery.description')}
          </AppText>

          <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            activeOpacity={0.8}>
            <AppText bold style={styles.buttonText}>
              {t('waterDelivery.donateNow')}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.imagesContainer}>
          <View style={styles.circleImage}>
            <AppText style={styles.imageEmoji}>💧</AppText>
          </View>
          <View style={styles.circleImage}>
            <AppText style={styles.imageEmoji}>🤲</AppText>
          </View>
          <View style={styles.circleImage}>
            <AppText style={styles.imageEmoji}>💧</AppText>
          </View>
        </View>
      </ImageBackground>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 70, 145, 0.8)',
    borderRadius: 16,
  },
  textContainer: {
    flex: 1,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.white,
    marginBottom: 16,
    opacity: 0.9,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagesContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  circleImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imageEmoji: {
    fontSize: 20,
  },
});
