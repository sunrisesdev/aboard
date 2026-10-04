import { clsx } from 'clsx';
import { Marquee } from '@/components/Marquee/Marquee';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import type { Extend, Structure } from '@/helpers/extend';
import { formatPlatform } from '@/helpers/formatPlatform';
import { formatTime } from '@/helpers/formatTime';
import { getDelay } from '@/helpers/getDelay';
import type { MotisMode, StopoverResource } from '@/lib/traewelling';
import styles from './TripStopoverItem.module.css';

export const TripStopoverItem = ({
  className,
  last = false,
  mode,
  onSelect,
  stopover,
  ...props
}: Extend<
  Structure,
  { last?: boolean; mode?: MotisMode; onSelect?: (stopover: StopoverResource) => void; stopover: StopoverResource }
>) => {
  const planned = stopover.arrivalPlanned ?? stopover.departurePlanned;
  const actual = stopover.arrivalReal ?? stopover.departureReal;
  const delay = planned ? getDelay(planned, actual) : undefined;

  return (
    <button className={clsx(styles.base, className)} type="button" onClick={() => onSelect?.(stopover)} {...props}>
      <TripLine className={styles.tripLine}>
        <TripLine.RouteSegment />
        <TripLine.StopIndicator />
        <TripLine.RouteSegment style={{ visibility: last ? 'hidden' : 'visible' }} />
      </TripLine>

      <div className={styles.content}>
        <Marquee>{cleanStationName(stopover.station.name)}</Marquee>

        {stopover.platform && (
          <span className={styles.platform}>{formatPlatform(stopover.platform, mode, { abbreviate: true })}</span>
        )}

        {planned && (
          <span className={styles.time}>
            {actual && formatTime(actual) !== formatTime(planned) && (
              <del className={styles.plannedTime}>{formatTime(planned)}</del>
            )}
            <span data-via-delay={delay?.status}>{formatTime(actual ?? planned)}</span>
          </span>
        )}
      </div>
    </button>
  );
};
