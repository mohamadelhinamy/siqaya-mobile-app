import React from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {AppText} from './core/AppText';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useLanguage} from '../context';
import {hp, wp} from '../utils/responsive';

// Import SVG icons
import HomeIcon from '../assets/icons/outlined/home.svg';
import ShopIcon from '../assets/icons/outlined/shop.svg';
import HandsIcon from '../assets/icons/outlined/hands.svg';
import GridIcon from '../assets/icons/outlined/grid.svg';
import ProfileIcon from '../assets/icons/outlined/profile-circle.svg';
import {Colors} from '../constants';

const {width} = Dimensions.get('window');

interface TabIconProps {
  name: string;
  focused: boolean;
  color: string;
  size: number;
}

const TabIcon: React.FC<TabIconProps> = ({name, focused, size}) => {
  const iconColor = focused ? Colors.primary : Colors.gray;

  const svgProps = {
    width: size,
    height: size,
    color: iconColor,
  };

  switch (name) {
    case 'Home':
      return <HomeIcon {...svgProps} />;
    case 'Products':
      return <ShopIcon {...svgProps} />;
    case 'Care':
      return <HandsIcon width={size} height={size} color={Colors.white} />;
    case 'Paths':
      return <GridIcon {...svgProps} />;
    case 'Profile':
      return <ProfileIcon {...svgProps} />;
    default:
      return <AppText style={{fontSize: size, color: iconColor}}>•</AppText>;
  }
};

interface CustomTabBarProps extends BottomTabBarProps {
  onCenterButtonPress?: () => void;
  style?: any;
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({
  state,
  navigation,
  onCenterButtonPress,
  style,
}) => {
  const {t} = useLanguage();

  // Determine if we should hide the tab bar (e.g. CartScreen inside Home stack)
  const focusedRootRoute = state.routes[state.index];
  let hideTabBar = false;
  if (
    (focusedRootRoute.name === 'Home' ||
      focusedRootRoute.name === 'Products' ||
      focusedRootRoute.name === 'Profile') &&
    (focusedRootRoute as any).state
  ) {
    const nestedState = (focusedRootRoute as any).state;
    const nestedFocusedRoute = nestedState.routes[nestedState.index];
    if (
      nestedFocusedRoute?.name === 'CartScreen' ||
      nestedFocusedRoute?.name === 'ProductDetails' ||
      nestedFocusedRoute?.name === 'ProfileDetailsScreen' ||
      nestedFocusedRoute?.name === 'MyProductsScreen' ||
      nestedFocusedRoute?.name === 'DonationsScreen'
    ) {
      hideTabBar = true;
    }
  }

  if (hideTabBar) {
    return null; // Do not render the tab bar
  }

  return (
    // 🔥 OUTER VIEW RECEIVES THE STYLE FROM NAVIGATION
    <View style={style}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const isCenterTab = route.name === 'Care';

            const onPress = () => {
              if (isCenterTab && onCenterButtonPress) {
                onCenterButtonPress();
                return;
              }

              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const getTabLabel = (routeName: string) => {
              switch (routeName) {
                case 'Home':
                  return t('navigation.home');
                case 'Products':
                  return t('navigation.products');
                case 'Care':
                  return t('navigation.care');
                case 'Paths':
                  return t('navigation.paths');
                case 'Profile':
                  return t('navigation.profile');
                default:
                  return routeName;
              }
            };

            if (isCenterTab) {
              return (
                <View key={route.key} style={styles.centerButtonContainer}>
                  <TouchableOpacity
                    style={styles.centerButton}
                    onPress={onPress}
                    activeOpacity={0.7}>
                    <TabIcon
                      name={route.name}
                      focused={false}
                      color={Colors.white}
                      size={28}
                    />
                  </TouchableOpacity>
                </View>
              );
            }

            return (
              <TouchableOpacity
                key={route.key}
                style={styles.tabButton}
                onPress={onPress}
                activeOpacity={0.7}>
                <TabIcon
                  name={route.name}
                  focused={isFocused}
                  color={isFocused ? Colors.primary : Colors.gray}
                  size={24}
                />
                <AppText
                  style={[
                    styles.tabLabel,
                    isFocused
                      ? styles.focusedTabLabel
                      : styles.unfocusedTabLabel,
                  ]}>
                  {getTabLabel(route.name)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    paddingBottom: hp(2.5),
  },
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingBottom: hp(1.5),
    paddingTop: hp(1.5),
    paddingHorizontal: wp(3),
    marginHorizontal: wp(4),
    borderRadius: wp(7.5),
    height: hp(9),
    shadowOffset: {
      width: 0,
      height: hp(1),
    },
    shadowOpacity: 0.15,
    shadowRadius: wp(4),
    elevation: 12,
  },
  tabButton: {
    width: (width - 64) / 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    height: '100%',
  },
  centerButton: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: hp(-4),
    shadowOffset: {
      width: 0,
      height: hp(1),
    },
    shadowOpacity: 0.25,
    shadowRadius: wp(3),
    elevation: 16,
    borderWidth: wp(0.75),
    borderColor: Colors.white,
  },
  centerButtonContainer: {
    width: (width - 64) / 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: hp(0.25),
    textAlign: 'center',
  },
  focusedTabLabel: {
    color: Colors.primary,
  },
  unfocusedTabLabel: {
    color: Colors.gray,
  },
});
