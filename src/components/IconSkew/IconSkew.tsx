import clsx from 'clsx';
import { Children } from 'react';
import styles from './IconSkew.module.scss';
import { IconSkewProps } from './types';

const IconSkew = ({ children, className, gap, size }: IconSkewProps) => {
  const items = [...Array(size)].map((_, row) => (
    <div className={styles.row} key={`row:${row}`} style={{ gap }}>
      {[...Array(row + 1)].map((_, column) => (
        <div className={styles.cell} key={`column:${column}`}>
          {Children.toArray(children).at(column % Children.count(children))}
        </div>
      ))}
    </div>
  ));

  return (
    <div className={clsx(styles.base, className)} style={{ gap }}>
      {items}
    </div>
  );
};

export default IconSkew;
