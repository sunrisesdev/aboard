import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './PageContent.module.css';

/**
 * @param stickyAside Keeps the aside in view: sticky next to the content on wide screens, above it on narrow ones.
 */
export const PageContent = ({
  aside,
  asidePosition = 'end',
  children,
  className,
  stickyAside = false,
  ...props
}: Extend<StructureWithChildren, { aside?: ReactNode; asidePosition?: 'start' | 'end'; stickyAside?: boolean }>) => {
  const asideColumn = <div className={clsx(styles.column, stickyAside && styles.stickyAside)}>{aside}</div>;

  return (
    <div className={clsx(styles.base, className)} {...props}>
      {aside ? (
        <div className={clsx(styles.content, styles.withAside, asidePosition === 'start' && styles.asideStart)}>
          {asidePosition === 'start' && asideColumn}
          <div className={styles.column}>{children}</div>
          {asidePosition === 'end' && asideColumn}
        </div>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
};
