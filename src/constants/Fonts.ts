/**
 * Font family constants and helpers
 * Only two fonts are used across the app (Juman Arabic): normal and bold.
 */

export const Fonts = {
  // The internal iOS family name that works is 'Juman' for both weights.
  // iOS will pick the correct face based on fontWeight when both TTFs are bundled.
  regular: 'Juman',
  bold: 'Juman',
} as const;

export type FontKey = keyof typeof Fonts; // 'regular' | 'bold'

// Map a weight value to the closest available family (regular|bold)
export const getFontFamily = (
  weight?: 'normal' | 'bold' | string | number,
  explicitBold?: boolean,
) => {
  // With 'Juman' family, we always use the same family name
  // and rely on fontWeight to select Regular vs Bold.
  return Fonts.regular;
};
