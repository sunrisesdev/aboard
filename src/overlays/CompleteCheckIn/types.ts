import { OverlayProps } from '@/components/Overlay/types';

export type CompleteCheckInOverlayProps = OverlayProps & {
  onComplete: () => Promise<void> | void;
};
