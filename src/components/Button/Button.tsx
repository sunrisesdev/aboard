import { Button as BaseButton } from '@base-ui/react/button';
import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonProps = BaseButton.Props & {
  alignStart?: boolean;
  iconOnly?: boolean;
  leadingSlot?: ReactNode;
  trailingSlot?: ReactNode;
  variant?: 'danger' | 'primary' | 'secondary';
};

export function Button({
  alignStart = false,
  children,
  className,
  iconOnly = false,
  leadingSlot,
  trailingSlot,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <BaseButton
      className={clsx(styles.base, className)}
      data-via-align-start={alignStart || undefined}
      data-via-icon-only={iconOnly || undefined}
      data-via-variant={variant}
      {...props}
    >
      {leadingSlot && (
        <span className={styles.slot} data-via-slot="leading">
          {leadingSlot}
        </span>
      )}
      {children}
      {trailingSlot && (
        <span className={styles.slot} data-via-slot="trailing">
          {trailingSlot}
        </span>
      )}
    </BaseButton>
  );
}
