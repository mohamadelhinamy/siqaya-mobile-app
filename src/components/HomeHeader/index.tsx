import React from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Colors} from '../../constants';

// Import SVG icons properly
import ShoppingCartIcon from '../../assets/icons/outlined/shopping-cart.svg';

interface HomeHeaderProps {
  onCartPress?: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({onCartPress}) => {
  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/soqya_header_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Cart Icon */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={onCartPress}
        activeOpacity={0.7}>
        <View style={styles.cartIconContainer}>
          <ShoppingCartIcon width={24} height={24} color={Colors.white} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 60,
  },
  cartButton: {
    padding: 8,
  },
  cartIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartIcon: {
    fontSize: 20,
    color: Colors.white,
  },
});
