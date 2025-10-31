import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import {getFontFamily} from '../../constants';

export type AppTextInputProps = RNTextInputProps;

export const AppTextInput: React.FC<AppTextInputProps> = ({style, ...rest}) => {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const restStyle = {...(flat || {})};
  delete (restStyle as any).fontWeight;
  delete (restStyle as any).fontFamily;
  const fontFamily = getFontFamily('normal');
  return <RNTextInput {...rest} style={[{fontFamily}, restStyle]} />;
};

export default AppTextInput;
