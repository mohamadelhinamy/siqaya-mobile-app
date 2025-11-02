import React from 'react';
import {Text, TextStyle, StyleProp} from 'react-native';
import {Fonts, Colors} from '../constants';
import {useRTLStyles} from '../context';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline'
  | 'button'
  | 'subtitle1'
  | 'subtitle2';

type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'text'
  | 'textPrimary'
  | 'textSecondary'
  | 'white'
  | 'black'
  | 'turquoise';

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: 'left' | 'center' | 'right' | 'auto';
  text: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  onPress?: () => void;
}

const getVariantStyles = (variant: TypographyVariant): TextStyle => {
  const styles: Record<TypographyVariant, TextStyle> = {
    h1: {
      fontSize: 32,
      fontFamily: Fonts.bold,
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontFamily: Fonts.bold,
      lineHeight: 36,
    },
    h3: {
      fontSize: 24,
      fontFamily: Fonts.bold,
      lineHeight: 32,
    },
    h4: {
      fontSize: 20,
      fontFamily: Fonts.bold,
      lineHeight: 28,
    },
    h5: {
      fontSize: 18,
      fontFamily: Fonts.bold,
      lineHeight: 24,
    },
    h6: {
      fontSize: 16,
      fontFamily: Fonts.bold,
      lineHeight: 22,
    },
    subtitle1: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      lineHeight: 22,
    },
    subtitle2: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      lineHeight: 20,
    },
    body1: {
      fontSize: 16,
      fontFamily: Fonts.regular,
      lineHeight: 24,
    },
    body2: {
      fontSize: 14,
      fontFamily: Fonts.regular,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontFamily: Fonts.regular,
      lineHeight: 16,
    },
    overline: {
      fontSize: 10,
      fontFamily: Fonts.regular,
      lineHeight: 14,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    button: {
      fontSize: 16,
      fontFamily: Fonts.bold,
      lineHeight: 20,
    },
  };

  return styles[variant];
};

const getColorStyles = (color: TypographyColor): TextStyle => {
  const colors: Record<TypographyColor, string> = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    success: Colors.success,
    error: Colors.error,
    warning: Colors.warning,
    text: Colors.text.primary,
    textPrimary: Colors.text.primary,
    textSecondary: Colors.text.secondary,
    white: Colors.white,
    black: Colors.text.primary,
    turquoise: Colors.text.turquoise,
  };

  return {color: colors[color]};
};

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'text',
  align = 'auto',
  text,
  style,
  numberOfLines,
  onPress,
}) => {
  const rtlStyles = useRTLStyles();

  const getTextAlign = () => {
    if (align === 'auto') {
      return rtlStyles.textAlign;
    }
    return align;
  };

  const combinedStyles: StyleProp<TextStyle> = [
    getVariantStyles(variant),
    getColorStyles(color),
    {textAlign: getTextAlign()},
    style,
  ];

  return (
    <Text
      style={combinedStyles}
      numberOfLines={numberOfLines}
      onPress={onPress}>
      {text}
    </Text>
  );
};

export {Typography};
