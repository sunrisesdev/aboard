import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, Structure } from '@/helpers/extend';
import styles from './KeyValueTag.module.css';

export const KeyValueTag = ({
  className,
  keySlot,
  valueSlot,
  ...props
}: Extend<Structure, { keySlot: ReactNode; valueSlot: ReactNode }>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      <span className={styles.key}>{keySlot}</span>
      <span className={styles.value}>{valueSlot}</span>
    </div>
  );
};
