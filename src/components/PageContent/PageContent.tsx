import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './PageContent.module.css';

export const PageContent = ({
  aside,
  children,
  className,
  ...props
}: Extend<StructureWithChildren, { aside?: ReactNode }>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      {aside ? (
        <div className={clsx(styles.content, styles.withAside)}>
          <div className={styles.column}>{children}</div>
          <div className={styles.column}>{aside}</div>
        </div>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
};
