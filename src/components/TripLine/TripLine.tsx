import { clsx } from 'clsx';
import type { Extend, Structure, StructureWithChildren } from '@/helpers/extend';
import styles from './TripLine.module.css';

const Root = ({ children, className, ...props }: Extend<StructureWithChildren>) => {
  return (
    <div aria-hidden className={clsx(styles.base, className)} {...props}>
      {children}
    </div>
  );
};

export const TripLineRouteSegment = ({ className, ...props }: Extend<Structure>) => {
  return <div className={clsx(styles.route, className)} {...props} />;
};

TripLineRouteSegment.displayName = 'TripLine.RouteSegment';

export const TripLineStopIndicator = ({ className, ...props }: Extend<Structure>) => {
  return <div className={clsx(styles.stop, className)} {...props} />;
};

TripLineStopIndicator.displayName = 'TripLine.StopIndicator';

export const TripLine = Object.assign(Root, {
  displayName: 'TripLine',
  RouteSegment: TripLineRouteSegment,
  StopIndicator: TripLineStopIndicator,
});
