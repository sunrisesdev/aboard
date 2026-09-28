import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/Badge/Badge';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatTime } from '@/helpers/formatTime';
import { isReplacementService } from '@/helpers/isReplacementService';
import type { DepartureResource } from '@/lib/traewelling';
import styles from './DepartureTripItem.module.css';

const travelTypeSymbols: Record<string, string> = {
  HIGHSPEED_RAIL: 'ICE',
  RAIL: 'IC',
  LONG_DISTANCE: 'IC',
  NIGHT_RAIL: 'IC',
  REGIONAL_RAIL: 'RE',
  REGIONAL_FAST_RAIL: 'RE',
  COACH: 'Fernbus',
  BUS: 'Bus',
  SUBURBAN: 'S-Bahn',
  SUBWAY: 'U-Bahn',
  METRO: 'U-Bahn',
  TRAM: 'Tram',
  FERRY: 'Schiff',
};

function getTransportSymbol(mode: string | null | undefined, replacementService: boolean) {
  const name = replacementService ? 'Ersatzverkehr-einfach' : mode ? travelTypeSymbols[mode.toUpperCase()] : undefined;

  return name ? `/symbols/${name}.svg` : undefined;
}

export const DepartureTripItem = ({ departure, stationId }: { departure: DepartureResource; stationId: string }) => {
  const time = departure.when ?? departure.plannedWhen;
  const replacementService = isReplacementService(departure);
  const symbol = getTransportSymbol(departure.line.mode, replacementService);
  const tripHref = `/trip/${encodeURIComponent(departure.tripId)}?${new URLSearchParams({
    station: String(departure.station.id),
    time: formatTime(time),
    line: departure.line.name ?? '',
  })}`;

  return (
    <Link href={tripHref} className={styles.base}>
      {symbol && <Image src={symbol} alt="" className={styles.symbol} width={20} height={20} />}
      <LineBadge name={departure.line.name ?? ''} color={departure.line.color} textColor={departure.line.textColor} />
      {replacementService && <Badge>SEV</Badge>}
      <span className={styles.direction}>
        {cleanStationName(departure.direction)}
        {departure.station.id !== Number(stationId) && (
          <span className={styles.origin}>ab {departure.station.name}</span>
        )}
      </span>
      {departure.plannedWhen !== time && <s>{formatTime(departure.plannedWhen)}</s>}
      <time dateTime={time}>{formatTime(time)}</time>
      {departure.platform && <span>Gleis {departure.platform}</span>}
      {departure.cancelled && <span className={styles.cancelled}>Ausfall</span>}
    </Link>
  );
};
