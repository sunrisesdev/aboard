import { HAFASProductType } from '@/traewelling-sdk/hafasTypes';
import { LineTheme } from './types';

export const LINE_COLORS: Record<string, LineTheme | undefined> = {
  // Hannover, Stadtbahn
  '8-webuet-1': { main: '#FF2E3E', mainRGB: '255, 46, 62' },
  '8-webuet-2': { main: '#FF2E3E', mainRGB: '255, 46, 62' },
  '8-webuet-3': { main: '#0073C0', mainRGB: '0, 115, 192' },
  '8-webuet-4': { main: '#FFAC2E', mainRGB: '255, 172, 46' },
  '8-webuet-5': { main: '#FFAC2E', mainRGB: '255, 172, 46' },
  '8-webuet-6': { main: '#FFAC2E', mainRGB: '255, 172, 46' },
  '8-webuet-7': { main: '#0073C0', mainRGB: '0, 115, 192' },
  '8-webuet-8': { main: '#FF2E3E', mainRGB: '255, 46, 62' },
  '8-webuet-9': { main: '#0073C0', mainRGB: '0, 115, 192' },
  '8-webuet-10': { main: '#6DC248', mainRGB: '109, 194, 72' },
  '8-webuet-11': { main: '#FFAC2E', mainRGB: '255, 172, 46' },
  '8-webuet-17': { main: '#6DC248', mainRGB: '109, 194, 72' },
};

export const PRODUCT_COLORS: Record<HAFASProductType, LineTheme> = {
  bus: { contrast: '#FFFFFF', main: '#A3007C', mainRGB: '163, 0, 124' },
  ferry: { contrast: '#FFFFFF', main: '#284B63', mainRGB: '40, 75, 99' },
  national: { contrast: '#FFFFFF', main: '#2B2D42', mainRGB: '43, 45, 66' },
  nationalExpress: {
    contrast: '#FFFFFF',
    main: '#2B2D42',
    mainRGB: '43, 45, 66',
  },
  regional: { contrast: '#FFFFFF', main: '#2B2D42', mainRGB: '43, 45, 66' },
  regionalExp: { contrast: '#FFFFFF', main: '#2B2D42', mainRGB: '43, 45, 66' },
  suburban: { contrast: '#FFFFFF', main: '#006F35', mainRGB: '0, 111, 53' },
  subway: { contrast: '#FFFFFF', main: '#0065AE', mainRGB: '0, 101, 174' },
  taxi: { contrast: '#FFFFFF', main: '#AF8000', mainRGB: '175, 128, 0' },
  tram: { contrast: '#FFFFFF', main: '#D91A1A', mainRGB: '217, 26, 26' },
};
