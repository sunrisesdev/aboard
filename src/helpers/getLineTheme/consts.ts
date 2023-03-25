import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { LineTheme } from './types';

export const LINE_COLORS: Record<string, LineTheme | undefined> = {
  // Hannover, Stadtbahn
  '8-webuet-1': { color: '#FF2E3E', colorRGB: '255, 46, 62' },
  '8-webuet-2': { color: '#FF2E3E', colorRGB: '255, 46, 62' },
  '8-webuet-3': { color: '#0073C0', colorRGB: '0, 115, 192' },
  '8-webuet-4': { color: '#FFAC2E', colorRGB: '255, 172, 46' },
  '8-webuet-5': { color: '#FFAC2E', colorRGB: '255, 172, 46' },
  '8-webuet-6': { color: '#FFAC2E', colorRGB: '255, 172, 46' },
  '8-webuet-7': { color: '#0073C0', colorRGB: '0, 115, 192' },
  '8-webuet-8': { color: '#FF2E3E', colorRGB: '255, 46, 62' },
  '8-webuet-9': { color: '#0073C0', colorRGB: '0, 115, 192' },
  '8-webuet-10': { color: '#6DC248', colorRGB: '109, 194, 72' },
  '8-webuet-11': { color: '#FFAC2E', colorRGB: '255, 172, 46' },
  '8-webuet-17': { color: '#6DC248', colorRGB: '109, 194, 72' },
};

export const PRODUCT_COLORS: Record<HAFASProductType, Required<LineTheme>> = {
  bus: {
    color: '#A3007C',
    colorRGB: '163, 0, 124',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  ferry: {
    color: '#284B63',
    colorRGB: '40, 75, 99',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  national: {
    color: '#2B2D42',
    colorRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  nationalExpress: {
    color: '#2B2D42',
    colorRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  regional: {
    color: '#2B2D42',
    colorRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  regionalExp: {
    color: '#2B2D42',
    colorRGB: '43, 45, 66',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  suburban: {
    color: '#006F35',
    colorRGB: '0, 111, 53',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  subway: {
    color: '#0065AE',
    colorRGB: '0, 101, 174',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  taxi: {
    color: '#AF8000',
    colorRGB: '175, 128, 0',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
  tram: {
    color: '#D91A1A',
    colorRGB: '217, 26, 26',
    contrast: '#FFFFFF',
    contrastRGB: '255, 255, 255',
  },
};
