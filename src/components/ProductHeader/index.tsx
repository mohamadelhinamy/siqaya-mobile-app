import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Colors} from '../../constants';
import {wp, hp} from '../../utils/responsive';
import SearchIcon from '../../assets/icons/outlined/search.svg';
import ShoppingCartIcon from '../../assets/icons/outlined/shopping-cart.svg';
import ExportIcon from '../../assets/icons/outlined/export.svg';
import {BackIcon} from '../Icons';

interface ProductHeaderProps {
  onBackPress: () => void;
  onSearchPress?: () => void;
  onCartPress?: () => void;
  onExportPress?: () => void;
  backgroundColor?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  onBackPress,
  onSearchPress,
  onExportPress,
  onCartPress,
  backgroundColor = Colors.white,
}) => {
  return (
    <View style={[styles.container, {backgroundColor}]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBackPress}
        activeOpacity={0.7}>
        <BackIcon width={wp(6)} height={wp(6)} color={Colors.primary} />
      </TouchableOpacity>

      {/* Right Side Icons */}
      <View style={styles.rightContainer}>
        {/* Search Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSearchPress}
          activeOpacity={0.7}>
          <SearchIcon width={wp(6)} height={wp(6)} color={Colors.primary} />
        </TouchableOpacity>
        {/* Export Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onExportPress}
          activeOpacity={0.7}>
          <ExportIcon width={wp(6)} height={wp(6)} color={Colors.primary} />
        </TouchableOpacity>

        {/* Cart Icon */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCartPress}
          activeOpacity={0.7}>
          <ShoppingCartIcon
            width={wp(6)}
            height={wp(6)}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lighter,
  },
  backButton: {
    padding: wp(2),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(1),
  },
  iconButton: {
    padding: wp(2),
  },
});
