import { IconHome2Filled } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { Marquee } from '@/components/Marquee/Marquee';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import type { Extend, Structure } from '@/helpers/extend';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import type { MotisMode, StopoverResource } from '@/lib/traewelling';
import styles from './TripStopoverItem.module.css';

export const TripStopoverItem = ({
  className,
  home = false,
  last = false,
  mode,
  onSelect,
  stopover,
  ...props
}: Extend<
  Structure,
  {
    home?: boolean;
    last?: boolean;
    mode?: MotisMode;
    onSelect?: (stopover: StopoverResource) => void;
    stopover: StopoverResource;
  }
>) => {
  const planned = stopover.arrivalPlanned ?? stopover.departurePlanned;
  const actual = stopover.arrivalReal ?? stopover.departureReal;
  const delay = planned ? getDelay(planned, actual) : undefined;

  return (
    <button
      className={clsx(styles.base, home && styles.isHome, className)}
      type="button"
      onClick={() => onSelect?.(stopover)}
      {...props}
    >
      <TripLine className={styles.tripLine}>
        <TripLine.RouteSegment />
        <TripLine.StopIndicator />
        <TripLine.RouteSegment style={{ visibility: last ? 'hidden' : 'visible' }} />
      </TripLine>

      <div className={styles.content}>
        <Marquee>{cleanStationName(stopover.station.name)}</Marquee>

        {home && <IconHome2Filled data-via-icon style={{ color: 'var(--via-focus-ring)' }} title="Heimatstation" />}

        {stopover.platform && (
          <span className={styles.platform}>{formatPlatform(stopover.platform, mode, { abbreviate: true })}</span>
        )}

        {planned && (
          <span className={styles.time}>
            {actual && formatDateTime(actual, 'time') !== formatDateTime(planned, 'time') && (
              <del className={styles.plannedTime}>{formatDateTime(planned, 'time')}</del>
            )}
            <span data-via-delay={delay?.status}>{formatDateTime(actual ?? planned, 'time')}</span>
          </span>
        )}
      </div>
    </button>
  );
};
