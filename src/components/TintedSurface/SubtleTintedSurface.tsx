import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import { getSubtleTintedPalette } from './getSubtleTintedPalette';
import { TintedSurfaceContent, tintedSurfaceFallbackColor } from './TintedSurface';
import styles from './TintedSurface.module.css';

/**
 * Shares the styles of TintedSurface, but uses the color for the text instead of the background.
 * @param attached The edge another surface is attached to, which loses its rounded corners.
 */
const Root = ({
  attached,
  children,
  className,
  color = tintedSurfaceFallbackColor,
  radius,
  style,
  ...props
}: Extend<
  StructureWithChildren,
  { attached?: 'bottom' | 'top'; color?: string; radius?: CSSProperties['borderRadius'] }
>) => {
  const palette = getSubtleTintedPalette(color);

  return (
    <div
      className={clsx(styles.base, className)}
      data-via-attached={attached}
      style={
        {
          ...style,
          '--via-tinted-surface-bg-from': palette.gradient.from,
          '--via-tinted-surface-bg-to': palette.gradient.to,
          '--via-tinted-surface-fg-primary': palette.foreground,
          '--via-tinted-surface-fg-secondary': palette.foregroundSecondary,
          '--via-tinted-surface-radius': radius,
        } as CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  );
};

export const SubtleTintedSurface = Object.assign(Root, {
  displayName: 'SubtleTintedSurface',
  Content: TintedSurfaceContent,
});
