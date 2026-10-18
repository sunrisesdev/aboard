import { clsx } from 'clsx';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { ButtonProps } from '@/components/Button/Button';
import buttonStyles from '@/components/Button/Button.module.css';
import type { Extend } from '@/helpers/extend';

// Looks like a Button, but navigates. Base UI's Button would announce a rendered link as a button.
export const ButtonLink = ({
  className,
  iconOnly = false,
  variant = 'primary',
  ...props
}: Extend<ComponentProps<typeof Link>, Pick<ButtonProps, 'iconOnly' | 'variant'>>) => (
  <Link
    className={clsx(buttonStyles.base, className)}
    data-via-icon-only={iconOnly || undefined}
    data-via-variant={variant}
    {...props}
  />
);
