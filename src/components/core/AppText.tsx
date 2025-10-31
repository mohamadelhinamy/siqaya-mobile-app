import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import {getFontFamily} from '../../constants';

export interface AppTextProps extends RNTextProps {
  bold?: boolean;
}

export const AppText: React.FC<AppTextProps> = ({style, bold, ...rest}) => {
  // Flatten incoming style and strip fontWeight/fontFamily (iOS will override custom fonts if fontWeight is present)
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const weight = flat?.fontWeight;

  const restStyle = {...(flat || {})};
  delete (restStyle as any).fontWeight;
  delete (restStyle as any).fontFamily;
  const resolvedFamily = getFontFamily(weight as any, bold);

  return <RNText {...rest} style={[{fontFamily: resolvedFamily}, restStyle]} />;
};

export default AppText;
