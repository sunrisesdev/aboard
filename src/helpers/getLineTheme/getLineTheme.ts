import { Theme } from '@/components/ThemeProvider/types';
import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { getContrastColor } from '../getContrastColor';
import { CUSTOM_LINE_THEMES, PRODUCT_THEMES } from './consts';

export const getLineTheme = (
  id: string,
  productType: HAFASProductType
): Required<Theme> => {
  const theme = CUSTOM_LINE_THEMES[id];

  if (!theme) {
    return PRODUCT_THEMES[productType];
  }

  const values = theme.accentRGB.split(',').map((v) => +v.trim());
  const contrast = getContrastColor(values[0], values[1], values[2]);

  return {
    contrast,
    contrastRGB: contrast === '#000000' ? '0, 0, 0' : '255, 255, 255',
    ...theme,
  };
};

export const getWhiteLineTheme = (
  id: string,
  productType: HAFASProductType
): Required<Theme> => {
  const theme = CUSTOM_LINE_THEMES[id];

  if (!theme) {
    const { accent, accentRGB } = PRODUCT_THEMES[productType];
    return {
      accent: '#FFF',
      accentRGB: '255, 255, 255',
      contrast: accent,
      contrastRGB: accentRGB,
    };
  }

  const { accent, accentRGB } = theme;

  return {
    accent: '#FFF',
    accentRGB: '255, 255, 255',
    contrast: accent,
    contrastRGB: accentRGB,
  };
};
