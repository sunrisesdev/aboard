import { clsx } from 'clsx';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { cleanStationName } from '@/helpers/cleanStationName';
import type { Extend, StructureWithChildren } from '@/helpers/extend';
import type { StopoverResource, TransportResource } from '@/lib/traewelling';
import { getCheckinMode } from '@/status/getCheckinMode';
import styles from './StatusTripHeader.module.css';

// Meant to be placed on a TintedSurface in the line's color. Children are appended after the direction.
export const StatusTripHeader = ({
  checkin,
  children,
  className,
  direction,
  ...props
}: Extend<StructureWithChildren, { checkin: TransportResource; direction?: StopoverResource }>) => {
  const mode = getCheckinMode(checkin);

  return (
    <header className={clsx(styles.base, className)} {...props}>
      <TransportModeIcon height={20} mode={mode} width={20} />

      <LineBadge
        backgroundColor={checkin.routeColor ?? undefined}
        color={checkin.routeTextColor ?? undefined}
        journeyNumber={checkin.manualJourneyNumber ?? String(checkin.journeyNumber)}
        mode={mode}
        name={checkin.lineName}
        productName={undefined}
      />

      {direction && (
        <em className={styles.direction}>
          <span className={styles.directionLabel}>Richtung</span>
          <abbr className={styles.directionAbbreviation} title="Richtung">
            Ri.
          </abbr>
          <Marquee>{cleanStationName(direction.station.name)}</Marquee>
        </em>
      )}

      {children}
    </header>
  );
};
