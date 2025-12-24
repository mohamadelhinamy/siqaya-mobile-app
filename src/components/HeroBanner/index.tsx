import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Colors} from '../../constants';
import {useLanguage} from '../../context';
import {wp} from '../../utils/responsive';
import {Typography, CustomButton} from '../index';

const {width: screenWidth} = Dimensions.get('window');

interface HeroSlide {
  id: string;
  image: any;
  title?: string;
  summary?: string;
  button_text?: string;
  link?: string;
  link_type?: number;
  link_target?: string;
  action_type?: string;
  mobile_navigation_component?: {
    id: number;
    name: string;
    value: string;
  };
  attribute_value?: string;
  sms_phone_number?: string;
  sms_message?: string;
}

interface HeroBannerProps {
  slides?: HeroSlide[];
  onPress?: (slide?: HeroSlide) => void;
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
  onPress,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const {isRTL} = useLanguage();

  const safeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  const stripHtml = (html = '') => html.replace(/<[^>]*>/g, '');

  const renderSlide = ({item}: any) => {
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
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onPress && onPress(item)}>
          <ImageBackground
            source={item.image}
            style={containerStyle}
            imageStyle={styles.backgroundImage}>
            <View style={styles.imageOverlay} />
            <View style={styles.slideContent}>
              <View>
                {item.title ? (
                  <Typography
                    variant="h5"
                    text={stripHtml(item.title)}
                    color="white"
                    style={styles.slideTitle}
                  />
                ) : null}
                {item.summary ? (
                  <Typography
                    variant="body2"
                    text={stripHtml(item.summary)}
                    color="white"
                    style={styles.slideSummary}
                  />
                ) : null}
              </View>

              {item.button_text ? (
                <View style={styles.slideButtonWrap}>
                  <CustomButton
                    title={item.button_text}
                    onPress={() => onPress && onPress(item)}
                    variant="primary"
                    size="small"
                    style={styles.slideButton}
                  />
                </View>
              ) : null}
            </View>
          </ImageBackground>
        </TouchableOpacity>
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
        vertical={false}
        onSnapToItem={index => {
          setActiveSlide(isRTL ? safeSlides.length - 1 - index : index);
        }}
        firstItem={
          safeSlides?.length > 0 ? (isRTL ? safeSlides?.length - 1 : 0) : 0
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
    paddingVertical: 18,
  },
  backgroundImage: {
    borderRadius: 16,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
  },
  slideContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  slideSummary: {
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'left',
  },
  slideButtonWrap: {
    alignSelf: 'flex-start',
    width: wp(36),
  },
  slideTitle: {
    textAlign: 'left',
    fontWeight: 'bold',
  },
  slideButton: {
    marginBottom: 0,
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
