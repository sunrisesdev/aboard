import { clsx } from 'clsx';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { ButtonProps } from '@/components/Button/Button';
import buttonStyles from '@/components/Button/Button.module.css';
import type { Extend } from '@/helpers/extend';

// Looks like a Button, but navigates. Base UI's Button would announce a rendered link as a button.
export const ButtonLink = ({
  alignStart = false,
  children,
  className,
  iconOnly = false,
  leadingSlot,
  trailingSlot,
  variant = 'primary',
  ...props
}: Extend<
  ComponentProps<typeof Link>,
  Pick<ButtonProps, 'alignStart' | 'iconOnly' | 'leadingSlot' | 'trailingSlot' | 'variant'>
>) => (
  <Link
    className={clsx(buttonStyles.base, className)}
    data-via-align-start={alignStart || undefined}
    data-via-icon-only={iconOnly || undefined}
    data-via-variant={variant}
    {...props}
  >
    {leadingSlot && (
      <span className={buttonStyles.slot} data-via-slot="leading">
        {leadingSlot}
      </span>
    )}
    {children}
    {trailingSlot && (
      <span className={buttonStyles.slot} data-via-slot="trailing">
        {trailingSlot}
      </span>
    )}
  </Link>
);
