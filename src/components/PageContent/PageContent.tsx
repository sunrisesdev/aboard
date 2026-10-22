import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './PageContent.module.css';

export const PageContent = ({
  aside,
  asidePosition = 'end',
  children,
  className,
  ...props
}: Extend<StructureWithChildren, { aside?: ReactNode; asidePosition?: 'start' | 'end' }>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      {aside ? (
        <div className={clsx(styles.content, styles.withAside, asidePosition === 'start' && styles.asideStart)}>
          {asidePosition === 'start' && <div className={styles.column}>{aside}</div>}
          <div className={styles.column}>{children}</div>
          {asidePosition === 'end' && <div className={styles.column}>{aside}</div>}
        </div>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
};
