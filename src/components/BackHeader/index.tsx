import React from 'react';
import {View, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../constants';
import {Typography} from '../Typography';
import {BackIcon} from '../Icons';
import {hp, wp} from '../../utils/responsive';

interface BackHeaderProps {
  title?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  backgroundColor?: string;
}

export const BackHeader: React.FC<BackHeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  backgroundColor = Colors.background.light,
}) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor}]}>
      <View style={styles.container}>
        {/* Back Button - positioned on the right for RTL */}
        {showBackButton && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}>
            <BackIcon width={24} height={24} color={Colors.text.primary} />
          </TouchableOpacity>
        )}

        {/* Title - centered */}
        {title && (
          <View style={styles.titleContainer}>
            <Typography
              variant="h5"
              color="textPrimary"
              text={title}
              style={styles.title}
            />
          </View>
        )}

        {/* Spacer to balance the layout when back button is present */}
        {showBackButton && <View style={styles.spacer} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.light,
  },
  container: {
    height: hp(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    backgroundColor: 'transparent',
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  spacer: {
    width: wp(10),
  },
});
