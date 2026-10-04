import { clsx } from 'clsx';
import type { ReactNode } from 'react';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './FieldsetCard.module.css';

const Root = ({
  children,
  className,
  icon,
  optional,
  title,
  ...props
}: Extend<StructureWithChildren, { icon?: ReactNode; optional?: boolean; title: ReactNode }>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      <header className={styles.header}>
        {icon && (
          <div aria-hidden className={styles.iconContainer}>
            {icon}
          </div>
        )}
        {title}
        {optional && <span className={styles.optionalHint}>optional</span>}
      </header>

      <div className={styles.content}>{children}</div>
    </div>
  );
};

export const FieldsetCardTitle = ({ className, children, ...props }: Extend<'label'>) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor will be supplied through props
    <label className={clsx(styles.title, className)} {...props}>
      {children}
    </label>
  );
};

export const FieldsetCard = Object.assign(Root, {
  displayName: 'FieldsetCard',
  Title: FieldsetCardTitle,
});
