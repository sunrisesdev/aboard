import { Theme } from '@/components/ThemeProvider/types';
import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';

export const CUSTOM_LINE_THEMES: Record<string, Theme | undefined> = {
  // Hannover, Stadtbahn
  '8-webuet-1': { accent: '#FF2E3E', accentRGB: '255, 46, 62' },
  '8-webuet-2': { accent: '#FF2E3E', accentRGB: '255, 46, 62' },
  '8-webuet-3': { accent: '#0073C0', accentRGB: '0, 115, 192' },
  '8-webuet-4': { accent: '#FFAC2E', accentRGB: '255, 172, 46' },
  '8-webuet-5': { accent: '#FFAC2E', accentRGB: '255, 172, 46' },
  '8-webuet-6': { accent: '#FFAC2E', accentRGB: '255, 172, 46' },
  '8-webuet-7': { accent: '#0073C0', accentRGB: '0, 115, 192' },
  '8-webuet-8': { accent: '#FF2E3E', accentRGB: '255, 46, 62' },
  '8-webuet-9': { accent: '#0073C0', accentRGB: '0, 115, 192' },
  '8-webuet-10': { accent: '#6DC248', accentRGB: '109, 194, 72' },
  '8-webuet-11': { accent: '#FFAC2E', accentRGB: '255, 172, 46' },
  '8-webuet-17': { accent: '#6DC248', accentRGB: '109, 194, 72' },
};

export const PRODUCT_THEMES: Record<HAFASProductType, Required<Theme>> = {
  bus: {
    accent: '#A3007C',
    accentRGB: '163, 0, 124',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  ferry: {
    accent: '#284B63',
    accentRGB: '40, 75, 99',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  national: {
    accent: '#2B2D42',
    accentRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  nationalExpress: {
    accent: '#2B2D42',
    accentRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  regional: {
    accent: '#2B2D42',
    accentRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  regionalExp: {
    accent: '#2B2D42',
    accentRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  suburban: {
    accent: '#006F35',
    accentRGB: '0, 111, 53',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  subway: {
    accent: '#0065AE',
    accentRGB: '0, 101, 174',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  taxi: {
    accent: '#AF8000',
    accentRGB: '175, 128, 0',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  tram: {
    accent: '#D91A1A',
    accentRGB: '217, 26, 26',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
};
