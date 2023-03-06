import { CSSProperties, ReactNode } from 'react';

export type ScrollAreaProps = {
  children: ReactNode;
  className?: string;
  noFog?: boolean;
  topFogBorderRadius?: CSSProperties['borderRadius'];
};
