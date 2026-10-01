import Link from 'next/link';
import type { CSSProperties } from 'react';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatTime } from '@/helpers/formatTime';
import { getColorsByMotisMode } from '@/helpers/getColorsByMotisMode';
import { isReplacementService } from '@/helpers/isReplacementService';
import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import styles from './DepartureTripItem.module.css';

export const DepartureTripItem = ({ departure, stationId }: { departure: DepartureResource; stationId: string }) => {
  const modeColors = getColorsByMotisMode(departure.line.mode ?? undefined) ?? [
    'var(--via-fg-primary)',
    'var(--via-bg-surface)',
  ];

  const replacementService = isReplacementService(departure);
  const time = departure.when ?? departure.plannedWhen;
  const tripHref = `/trip/${encodeURIComponent(departure.tripId)}?${new URLSearchParams({
    station: String(departure.station.id),
    time: formatTime(time),
    line: departure.line.name ?? '',
  })}`;

  return (
    <Link
      className={styles.base}
      href={tripHref}
      style={{ '--via-line-bg': modeColors[0], '--via-line-fg': modeColors[1] } as CSSProperties}
    >
      <time className={styles.time} dateTime={time}>
        {formatTime(time)}
      </time>

      <div className={styles.content}>
        <div className={styles.topLine}>
          <LineBadge
            backgroundColor={departure.line.color ?? undefined}
            color={departure.line.textColor ?? undefined}
            journeyNumber={departure.line.fahrtNr}
            mode={departure.line.mode as MotisMode | undefined}
            name={departure.line.name}
            productName={departure.line.product ?? undefined}
          />
          <span className={styles.direction}>{cleanStationName(departure.direction)}</span>
          <span className={styles.delay}>
            {departure.plannedWhen !== time ? <s>{formatTime(departure.plannedWhen)}</s> : 'pünktlich'}
          </span>
        </div>

        <div className={styles.statusLine}>
          <TransportModeIcon
            icon={replacementService ? 'replacement-bus' : undefined}
            mode={departure.line.mode ?? undefined}
          />
          {departure.line.fahrtNr && departure.line.fahrtNr !== departure.line.name && (
            <span>{departure.line.fahrtNr}</span>
          )}
          {replacementService && <span>SEV</span>}
          {departure.platform && <span>Gleis {departure.platform}</span>}
          {departure.station.id !== Number(stationId) && (
            <span className={styles.origin}>ab {departure.station.name}</span>
          )}
          {departure.cancelled && <span className={styles.cancelled}>Ausfall</span>}
        </div>
      </div>
    </Link>
  );
};
