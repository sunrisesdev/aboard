import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './Badge.module.css';

export const Badge = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <span className={clsx(styles.base, className)} {...props}>
      {children}
    </span>
  );
};
