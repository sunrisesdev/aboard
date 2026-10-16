import { clsx } from 'clsx';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import styles from './NavbarAttachment.module.css';

/**
 * Attaches its children to the navbar's lower edge, so that they overlap it by half their height.
 * @remarks Must be rendered as the first element of a page.
 */
export const NavbarAttachment = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <div className={clsx(styles.base, className)} {...props}>
      <div className={styles.content}>{children}</div>
    </div>
  );
};
