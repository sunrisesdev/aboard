import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './Card.module.css';

export const Card = ({ className, ...props }: Extend<StructureWithChildren>) => {
  return <div className={clsx(styles.base, className)} {...props} />;
};
