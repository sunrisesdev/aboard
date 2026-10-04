import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './ColoredLayer.module.css';

const Root = ({
  children,
  className,
  color,
  radius,
  style,
  ...props
}: Extend<StructureWithChildren, { color: string; radius?: CSSProperties['borderRadius'] }>) => {
  return (
    <div
      className={clsx(styles.base, className)}
      style={{ ...style, '--via-colored-layer-bg': color, '--via-colored-layer-radius': radius } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
};

export const ColoredLayerContent = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
};

ColoredLayerContent.displayName = 'ColoredLayer.Content';

export const ColoredLayer = Object.assign(Root, {
  displayName: 'ColoredLayer',
  Content: ColoredLayerContent,
});
