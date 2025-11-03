import React from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {CloseIcon} from './Icons';
import {Colors} from '../constants';
import {useLanguage, useRTLStyles} from '../context';

interface CloseHeaderProps {
  onPress: () => void;
  iconColor?: string;
  size?: number;
}

export const CloseHeader: React.FC<CloseHeaderProps> = ({
  onPress,
  iconColor = Colors.text.secondary,
  size = 24,
}) => {
  const {t} = useLanguage();
  const rtlStyles = useRTLStyles();

  return (
    <View
      style={[
        styles.container,
        rtlStyles.isRTL ? styles.leftPosition : styles.rightPosition,
      ]}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.closeButton}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        accessibilityLabel={t('common.close')}
        accessibilityRole="button">
        <CloseIcon width={size} height={size} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    zIndex: 1000,
  },
  leftPosition: {
    left: 20,
  },
  rightPosition: {
    right: 20,
  },
  closeButton: {
    padding: 8,
  },
});
