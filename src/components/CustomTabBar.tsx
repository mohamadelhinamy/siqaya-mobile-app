import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {useLanguage} from '../context';

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

  const renderIcon = () => {
    const svgProps = {
      width: size,
      height: size,
      color: iconColor,
    };

    // Now SVGs use currentColor and will properly inherit the dynamic color
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
        return <Text style={{fontSize: size, color: iconColor}}>•</Text>;
    }
  };

  return renderIcon();
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const {t, isRTL} = useLanguage();

  const styles = StyleSheet.create({
    wrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
      paddingBottom: 20, // Move up from bottom
    },
    container: {
      flexDirection: 'row',
      backgroundColor: Colors.white,
      paddingBottom: 12,
      paddingTop: 12,
      paddingHorizontal: 12,
      marginHorizontal: 16,
      borderRadius: 30,
      height: 70,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.15,
      shadowRadius: 16,
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
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: Colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      top: -32,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 16,
      borderWidth: 3,
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
      marginTop: 2,
      textAlign: 'center',
    },
    focusedTabLabel: {
      color: Colors.primary,
    },
    unfocusedTabLabel: {
      color: Colors.gray,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const isCenterTab = route.name === 'Care';

          const onPress = () => {
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
              <Text
                style={[
                  styles.tabLabel,
                  isFocused ? styles.focusedTabLabel : styles.unfocusedTabLabel,
                ]}>
                {getTabLabel(route.name)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
