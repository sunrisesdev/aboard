import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { getContrastColor } from '../getContrastColor';
import { LINE_COLORS, PRODUCT_COLORS } from './consts';
import { LineTheme } from './types';

export const getLineTheme = (
  id: string,
  productType: HAFASProductType
): LineTheme => {
  const theme = LINE_COLORS[id];

  if (!theme) {
    return PRODUCT_COLORS[productType];
  }

  const values = theme.mainRGB.split(',').map((v) => +v.trim());

  return {
    contrast: getContrastColor(values[0], values[1], values[2]),
    ...theme,
  };
};
