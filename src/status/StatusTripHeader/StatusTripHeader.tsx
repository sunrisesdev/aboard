import { clsx } from 'clsx';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { cleanStationName } from '@/helpers/cleanStationName';
import type { Extend, Structure } from '@/helpers/extend';
import type { MotisMode, StopoverResource, TransportResource } from '@/lib/traewelling';
import styles from './StatusTripHeader.module.css';

// Meant to be placed on a TintedSurface in the line's color
export const StatusTripHeader = ({
  checkin,
  className,
  direction,
  ...props
}: Extend<Structure, { checkin: TransportResource; direction?: StopoverResource }>) => (
  <header className={clsx(styles.base, className)} {...props}>
    <TransportModeIcon height={20} mode={checkin.mode ?? undefined} width={20} />

    <LineBadge
      backgroundColor={checkin.routeColor ?? undefined}
      className={styles.lineBadge}
      color={checkin.routeTextColor ?? undefined}
      journeyNumber={checkin.manualJourneyNumber ?? String(checkin.journeyNumber)}
      mode={(checkin.mode ?? undefined) as MotisMode | undefined}
      name={checkin.lineName}
      productName={undefined}
    />

    {direction && (
      <em className={styles.direction}>
        Richtung <Marquee>{cleanStationName(direction.station.name)}</Marquee>
      </em>
    )}
  </header>
);
