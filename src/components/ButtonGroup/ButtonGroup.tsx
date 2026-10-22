import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './ButtonGroup.module.css';

export const ButtonGroup = ({
  className,
  uneven = false,
  ...props
}: Extend<StructureWithChildren, { uneven?: boolean }>) => {
  // biome-ignore lint/a11y/useSemanticElements: this is fine
  return <div className={clsx(styles.base, uneven && styles.isUneven, className)} role="group" {...props} />;
};
