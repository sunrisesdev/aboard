import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './PageContent.module.css';

export const PageContent = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
