import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Colors} from '../../constants';
import {useLanguage} from '../../context';

const {width: screenWidth} = Dimensions.get('window');

interface HeroSlide {
  id: string;
  image: any;
}

interface HeroBannerProps {
  slides?: HeroSlide[];
  onPress?: () => void;
}

const defaultSlides: HeroSlide[] = [
  {
    id: '1',
    image: require('../../assets/images/hero.png'),
  },
  {
    id: '2',
    image: require('../../assets/images/hero.png'),
  },
  {
    id: '3',
    image: require('../../assets/images/hero.png'),
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  slides = defaultSlides,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const {isRTL} = useLanguage();

  const safeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  const renderSlide = ({item}: {item: HeroSlide}) => {
    if (!item) {
      return null;
    }
    const containerStyle: ViewStyle = {
      ...styles.container,
      alignItems: 'flex-start',
    };

    const wrapper: ViewStyle = {
      ...styles.wrapper,
    };

    return (
      <View style={wrapper}>
        <ImageBackground
          source={item.image}
          style={containerStyle}
          imageStyle={styles.backgroundImage}
        />
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {safeSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeSlide ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        // reverse slides based on isRTL
        data={isRTL ? [...safeSlides].reverse() : safeSlides}
        renderItem={renderSlide}
        sliderWidth={screenWidth}
        inactiveSlideScale={1}
        itemWidth={screenWidth}
        inactiveSlideOpacity={1}
        onSnapToItem={index => {
          setActiveSlide(isRTL ? safeSlides.length - 1 - index : index);
        }}
        defaultIndex={
          safeSlides?.length > 0
            ? isRTL
              ? safeSlides?.length - 1
              : 0
            : undefined
        }
        autoplay={true}
        autoplayDelay={3000}
        autoplayInterval={4000}
        loop={false}
        layoutCardOffset={18}
      />
      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 12,
  },
  wrapper: {
    padding: 16,
  },
  container: {
    height: 180,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  textContainer: {
    zIndex: 1,
    maxWidth: '70%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    marginBottom: 16,
    opacity: 0.9,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: Colors.gray,
    opacity: 0.4,
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    opacity: 1,
    width: 24,
  },
});
