import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {Typography} from '../Typography';
import {Colors} from '../../constants';
import {hp, wp} from '../../utils/responsive';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onValueChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  horizontal?: boolean;
  required?: boolean;
  disabled?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  value,
  onValueChange,
  containerStyle,
  horizontal = true,
  required = false,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          variant="h5"
          color="textPrimary"
          text={`${label}${required ? ' *' : ''}`}
          style={styles.label}
        />
      )}
      <View style={[styles.optionsContainer, horizontal && styles.horizontal]}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={styles.option}
            onPress={() => !disabled && onValueChange(option.value)}
            disabled={disabled}
            activeOpacity={0.7}>
            <View
              style={[
                styles.radioButton,
                value === option.value && styles.radioButtonSelected,
                disabled && styles.radioButtonDisabled,
              ]}
            />
            <Typography
              variant="body1"
              color={disabled ? 'textSecondary' : 'textPrimary'}
              text={option.label}
              style={styles.optionLabel}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(4),
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {},
  optionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: hp(1),
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: wp(6),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
    gap: wp(2),
  },
  radioButton: {
    width: wp(6),
    height: wp(6),
    borderRadius: wp(3),
    borderWidth: 2,
    borderColor: Colors.light,
    backgroundColor: Colors.white,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  radioButtonDisabled: {
    borderColor: Colors.light,
    backgroundColor: Colors.background.light,
    opacity: 0.5,
  },
  optionLabel: {},
});
