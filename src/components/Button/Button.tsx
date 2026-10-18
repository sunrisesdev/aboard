import { Button as BaseButton } from '@base-ui/react/button';
import { clsx } from 'clsx';
import styles from './Button.module.css';

export type ButtonProps = BaseButton.Props & {
  iconOnly?: boolean;
  variant?: 'danger' | 'primary' | 'secondary';
};

export function Button({ className, iconOnly = false, variant = 'primary', ...props }: ButtonProps) {
  return (
    <BaseButton
      className={clsx(styles.base, className)}
      data-via-icon-only={iconOnly || undefined}
      data-via-variant={variant}
      {...props}
    />
  );
}
