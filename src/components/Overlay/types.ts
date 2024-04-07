import { CSSProperties, ReactNode } from 'react';

export type OverlayProps = {
  collapsedSnapHeight?: number;
  initialSnapPosition?: number;
  isActive: boolean;
  isHidden?: boolean;
  onBackdropTap?: () => void;
  onClose?: () => void;
  staticBackdrop?: boolean;
  withBackdrop?: boolean;
};

export type OverlayRootProps = OverlayProps & {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
