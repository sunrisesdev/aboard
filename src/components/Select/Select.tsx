import { IconChevronDown } from '@tabler/icons-react';
import { clsx } from 'clsx';
import inputStyles from '@/components/Input/Input.module.css';
import type { Extend } from '@/helpers/extend';
import styles from './Select.module.css';

// Structural props go to the wrapper, so the select and its chevron are laid out together
export const Select = ({ className, style, ...props }: Extend<'select'>) => (
  <span className={clsx(styles.base, className)} style={style}>
    <select className={clsx(inputStyles.base, styles.select)} {...props} />
    <IconChevronDown aria-hidden className={styles.icon} data-via-icon />
  </span>
);
