import { Button as BaseButton } from '@base-ui/react/button';
import { clsx } from 'clsx';
import styles from './Button.module.css';

type ButtonProps = BaseButton.Props & {
  variant?: 'primary' | 'secondary';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <BaseButton className={clsx(styles.base, className)} data-via-variant={variant} {...props} />;
}
