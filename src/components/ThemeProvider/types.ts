import { ReactNode } from 'react';

export type Theme = {
  accent: string;
  accentRGB: `${number}, ${number}, ${number}`;
  contrast?: string;
  contrastRGB?: `${number}, ${number}, ${number}`;
};

export type ThemeProviderProps = {
  children: ReactNode;
  color?: string;
  colorRGB?: string;
  contrast?: string;
  contrastRGB?: string;
  theme?: Theme;
};
