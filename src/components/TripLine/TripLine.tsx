import { clsx } from 'clsx';
import type { Extend, Structure, StructureWithChildren } from '@/helpers/extend';
import styles from './TripLine.module.css';

const Root = ({
  children,
  className,
  orientation = 'vertical',
  ...props
}: Extend<StructureWithChildren, { orientation?: 'horizontal' | 'vertical' }>) => {
  return (
    <div aria-hidden className={clsx(styles.base, className)} data-via-orientation={orientation} {...props}>
      {children}
    </div>
  );
};

export const TripLineRouteSegment = ({
  className,
  partial = false,
  ...props
}: Extend<Structure, { partial?: boolean }>) => {
  return <div className={clsx(styles.route, partial && styles.isPartial, className)} {...props} />;
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
