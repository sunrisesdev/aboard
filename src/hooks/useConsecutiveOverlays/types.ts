import { OverlayProps } from '@/components/Overlay/types';

export type ConsecutiveOverlays<T extends string> = {
  [O in `${T}Props`]: OverlayProps;
};
