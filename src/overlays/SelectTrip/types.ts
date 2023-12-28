import { OverlayProps } from '@/components/Overlay/types';

export type SelectTripOverlayProps = OverlayProps & {
  onComplete: () => void;
};
