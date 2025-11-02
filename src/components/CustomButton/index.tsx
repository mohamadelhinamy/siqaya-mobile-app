import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import {Typography} from '../Typography';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'large',
  style,
  fullWidth = true,
}) => {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: StyleProp<ViewStyle>[] = [styles.button];

    // Add variant styles
    switch (variant) {
      case 'primary':
        baseStyle.push(styles.primaryButton);
        if (isDisabled) {
          baseStyle.push(styles.primaryButtonDisabled);
        }
        break;
      case 'secondary':
        baseStyle.push(styles.secondaryButton);
        if (isDisabled) {
          baseStyle.push(styles.secondaryButtonDisabled);
        }
        break;
      case 'outline':
        baseStyle.push(styles.outlineButton);
        if (isDisabled) {
          baseStyle.push(styles.outlineButtonDisabled);
        }
        break;
    }

    // Add size styles
    switch (size) {
      case 'small':
        baseStyle.push(styles.smallButton);
        break;
      case 'medium':
        baseStyle.push(styles.mediumButton);
        break;
      case 'large':
        baseStyle.push(styles.largeButton);
        break;
    }

    if (fullWidth) {
      baseStyle.push(styles.fullWidth);
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (variant === 'outline') {
      return isDisabled ? 'textSecondary' : 'primary';
    }
    return 'white';
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Typography
          variant="button"
          color={getTextColor()}
          text={title}
          style={styles.buttonText}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(3),
  },
  fullWidth: {
    width: '100%',
  },
  // Size variants
  smallButton: {
    paddingVertical: hp(1.5),
    minHeight: hp(5),
  },
  mediumButton: {
    paddingVertical: hp(2),
    minHeight: hp(6),
  },
  largeButton: {
    paddingVertical: hp(2.2),
    minHeight: hp(7),
  },
  // Variant styles
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  primaryButtonDisabled: {
    backgroundColor: Colors.primaryLight,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  secondaryButtonDisabled: {
    backgroundColor: Colors.light,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlineButtonDisabled: {
    borderColor: Colors.light,
    backgroundColor: 'transparent',
  },
  buttonText: {
    textAlign: 'center',
  },
});
