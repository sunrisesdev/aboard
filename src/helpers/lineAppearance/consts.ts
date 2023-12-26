import { AboardLineAppearance, AboardMethod } from '@/types/aboard';

export const FALLBACK_METHOD_APPEARANCES: Record<
  AboardMethod,
  Partial<AboardLineAppearance>
> = {
  bus: {
    accentColor: '#A3007C',
    background: '#A3007C',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'pill',
  },
  ferry: {
    accentColor: '#284B63',
    background: '#284B63',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'trapezoid',
  },
  national: {
    accentColor: '#2B2D42',
    background: '#2B2D42',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  'national-express': {
    accentColor: '#2B2D42',
    background: '#2B2D42',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  regional: {
    accentColor: '#415A77',
    background: '#415A77',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  'regional-express': {
    accentColor: '#415A77',
    background: '#415A77',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  suburban: {
    accentColor: '#006F35',
    background: '#006F35',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  subway: {
    accentColor: '#0065AE',
    background: '#0065AE',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'rectangle',
  },
  taxi: {
    accentColor: '#AF8000',
    background: '#AF8000',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'smooth-rectangle',
  },
  tram: {
    accentColor: '#D91A1A',
    background: '#D91A1A',
    color: '#FFFFFF',
    contrastColor: '#FFFFFF',
    shape: 'pill',
  },
};

export const LINE_APPEARANCE_OVERRIDES: [
  RegExp,
  Partial<AboardLineAppearance>,
][] = [
  // [
  //   /^5-hvv[a-z]{3}-\d+$/, // All bus lines operated in Hamburg
  //   { accentColor: '#E2001A', background: '#E2001A', shape: 'hexagon' },
  // ],
  // [
  //   /^6-hvvhad-\d+$/, // All ferries operated by HADAG in Hamburg
  //   {
  //     accentColor: '#00B7E1',
  //     background: '#00B7E1',
  //     color: '#FFFFFF',
  //     contrastColor: '#000000',
  //   },
  // ],
  // [
  //   /^7-swm001-7$/, // U7 operated by SWM in München
  //   {
  //     accentColor: '#C3022D',
  //     background: 'linear-gradient(to bottom right, #51832B 50%, #C3022D 50%)',
  //   },
  // ],
  // [
  //   /^7-swm001-8$/, // U8 operated by SWM in München
  //   {
  //     accentColor: '#C3022D',
  //     background: 'linear-gradient(to bottom right, #C3022D 50%, #ED6720 50%)',
  //   },
  // ],
  [/^8-webuet-\d{1,2}$/, { shape: 'square' }], // All tram lines operated by ÜSTRA in Hannover
];
