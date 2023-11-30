import { CSSProperties, ReactNode } from 'react';

export type OverlayProps = {
  initialSnapPosition?: number;
  isActive: boolean;
  isHidden?: boolean;
  onBackdropTap?: () => void;
  onClose?: () => void;
  withBackdrop?: boolean;
};

export type OverlayRootProps = OverlayProps & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
