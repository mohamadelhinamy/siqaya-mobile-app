import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import {Typography} from './Typography';
import {Colors} from '../constants';
import {useRTLStyles} from '../context';

interface CustomInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  labelColor?: string;
  errorColor?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  inputStyle,
  labelColor,
  errorColor = Colors.error,
  ...textInputProps
}) => {
  const rtlStyles = useRTLStyles();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Typography
          variant="body2"
          color={labelColor ? undefined : 'textPrimary'}
          style={[styles.label, labelColor && {color: labelColor}]}>
          {label}
          {required && (
            <Typography variant="body2" color="error">
              {' *'}
            </Typography>
          )}
        </Typography>
      )}

      <TextInput
        style={[
          styles.input,
          {textAlign: rtlStyles.textAlign},
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={Colors.text.secondary}
        {...textInputProps}
      />

      {error && (
        <Typography
          variant="caption"
          style={[styles.errorText, {color: errorColor}]}>
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 0.5,
    borderColor: Colors.light,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: Colors.white,
    color: Colors.text.primary,
    minHeight: 56,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    marginTop: 4,
  },
});
