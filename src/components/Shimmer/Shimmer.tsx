import clsx from 'clsx';
import { CSSProperties } from 'react';
import styles from './Shimmer.module.scss';
import { ShimmerProps } from './types';

const Shimmer = ({ className, height, style, width }: ShimmerProps) => {
  return (
    <div
      className={clsx(styles.base, className)}
      style={
        {
          ...style,
          '--shimmer-height': height,
          '--shimmer-width': width,
        } as CSSProperties
      }
    />
  );
};

export default Shimmer;
