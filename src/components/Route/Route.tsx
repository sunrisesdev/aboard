import clsx from 'clsx';
import styles from './Route.module.scss';
import {
  RouteEntryProps,
  RouteLineProps,
  RouteProps,
  RouteStopIndicatorProps,
  RouteTimeProps,
} from './types';

const Route = ({ children, className }: RouteProps) => {
  return <ul className={clsx(styles.base, className)}>{children}</ul>;
};

const RouteEntry = ({
  children,
  className,
  lineSlot,
  stopIndicatorVariant,
}: RouteEntryProps) => {
  return (
    <li className={clsx(styles.entry, className)}>
      <aside className={styles.decoration}>
        <RouteStopIndicator variant={stopIndicatorVariant} />
        {lineSlot}
      </aside>
      <main className={styles.content}>{children}</main>
    </li>
  );
};

const RouteLine = ({ variant = 'default' }: RouteLineProps) => {
  if (variant === 'hybrid') {
    return (
      <div className={styles.hybridLine}>
        <div className={styles.top} />
        <div className={styles.bottom} />
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.line, variant !== 'default' && styles[variant])}
    />
  );
};

const RouteStopIndicator = ({
  className,
  variant = 'default',
}: RouteStopIndicatorProps) => {
  return (
    <div
      className={clsx(
        styles.stopIndicator,
        variant !== 'default' && styles[variant],
        className
      )}
    />
  );
};

const RouteTime = ({ schedule, type }: RouteTimeProps) => {
  return (
    <span className={styles.time}>
      {type === 'arrival' ? 'an' : 'ab'} {schedule.planned}
      {!schedule.isOnTime && (
        <span>
          &nbsp;<sup>+{schedule.delayInMinutes}</sup>
        </span>
      )}
    </span>
  );
};

Route.Entry = RouteEntry;
Route.Line = RouteLine;
Route.StopIndicator = RouteStopIndicator;
Route.Time = RouteTime;

export default Route;
