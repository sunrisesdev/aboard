import { CSSProperties, ReactNode } from 'react';

export type ScrollAreaProps = {
  bottomFogBorderRadius?: CSSProperties['borderRadius'];
  children: ReactNode;
  className?: string;
  noFog?: boolean;
  topFogBorderRadius?: CSSProperties['borderRadius'];
};
