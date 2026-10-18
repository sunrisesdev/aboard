import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './ButtonGroup.module.css';

export const ButtonGroup = ({ className, ...props }: Extend<StructureWithChildren>) => {
  return <div className={clsx(styles.base, className)} role="group" {...props} />;
};
