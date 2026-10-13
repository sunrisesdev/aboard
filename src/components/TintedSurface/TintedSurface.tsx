import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import { getTintedPalette } from './getTintedPalette';
import styles from './TintedSurface.module.css';

// Equals --via-neutral-100, which can't be used here since the palette needs a parsable color
export const tintedSurfaceFallbackColor = 'oklch(97% 0 none)';

const Root = ({
  children,
  className,
  color = tintedSurfaceFallbackColor,
  radius,
  style,
  ...props
}: Extend<StructureWithChildren, { color?: string; radius?: CSSProperties['borderRadius'] }>) => {
  const palette = getTintedPalette(color);

  return (
    <div
      className={clsx(styles.base, className)}
      style={
        {
          ...style,
          '--via-tinted-surface-bg-badge': palette.badgeBackground,
          '--via-tinted-surface-bg-contrast': palette.contrastBackground,
          '--via-tinted-surface-bg-from': palette.gradient.from,
          '--via-tinted-surface-bg-to': palette.gradient.to,
          '--via-tinted-surface-delay-early': palette.status.early,
          '--via-tinted-surface-delay-late': palette.status.late,
          '--via-tinted-surface-delay-on-time': palette.status.onTime,
          '--via-tinted-surface-delay-slight': palette.status.slight,
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

export const TintedSurfaceContent = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <div className={clsx(styles.content, className)} {...props}>
      {children}
    </div>
  );
};

TintedSurfaceContent.displayName = 'TintedSurface.Content';

export const TintedSurface = Object.assign(Root, {
  displayName: 'TintedSurface',
  Content: TintedSurfaceContent,
});
