import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/types/extend';
import { SubtleTintedSurface } from '../TintedSurface/SubtleTintedSurface';
import styles from './StatCards.module.css';

const Root = ({ children, className, ...props }: StructureWithChildren) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      {children}
    </div>
  );
};

const Item = ({
  className,
  color,
  descriptionSlot,
  isWide,
  labelSlot,
  signetSlot,
  valueSlot,
  ...props
}: Extend<
  StructureWithChildren,
  {
    color: string;
    descriptionSlot?: ReactNode;
    isWide?: boolean;
    labelSlot?: ReactNode;
    signetSlot: ReactNode;
    valueSlot: ReactNode;
  }
>) => {
  return (
    <SubtleTintedSurface
      className={clsx(styles.stat, isWide && styles.isWide, className)}
      color={color}
      radius="0.75rem"
      {...props}
    >
      <SubtleTintedSurface.Content className={styles.content}>
        {labelSlot && <div className={styles.label}>{labelSlot}</div>}
        <div className={styles.value}>{valueSlot}</div>
        {descriptionSlot && <em className={styles.description}>{descriptionSlot}</em>}

        <span aria-hidden className={styles.signet}>
          {signetSlot}
        </span>
      </SubtleTintedSurface.Content>
    </SubtleTintedSurface>
  );
};

export const StatCards = Object.assign(Root, {
  displayName: 'StatCards',
  Item,
});
