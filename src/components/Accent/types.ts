import { LineTheme } from '@/helpers/getLineTheme/types';
import { ReactNode } from 'react';

export type AccentProps = {
  children: ReactNode;
  color?: string;
  colorRGB?: string;
  contrast?: string;
  contrastRGB?: string;
  theme?: LineTheme;
};
