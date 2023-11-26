import { OverlayProps } from '@/components/Overlay/types';

export type SelectDestinationOverlayProps = OverlayProps & {
  onComplete: () => void;
};
