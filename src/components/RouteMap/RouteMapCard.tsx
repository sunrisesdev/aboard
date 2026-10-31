import { clsx } from 'clsx';
import type { ComponentProps } from 'react';
import { RouteMap } from './RouteMap';
import styles from './RouteMapCard.module.css';

// Square by default, other aspect ratios can be set with --via-route-map-card-aspect-ratio
export const RouteMapCard = ({ className, ...props }: ComponentProps<typeof RouteMap>) => {
  return (
    <div className={clsx(styles.base, className)}>
      <RouteMap className={styles.map} {...props} />
    </div>
  );
};
