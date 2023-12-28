import { OverlayProps } from '@/components/Overlay/types';

export type SelectOriginOverlayProps = OverlayProps & {
  onComplete: () => void;
};
