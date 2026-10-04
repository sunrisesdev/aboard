'use client';

import { IconArrowRight } from '@tabler/icons-react';
import { clsx } from 'clsx';
import { ColoredLayer } from '@/components/ColoredLayer/ColoredLayer';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDuration } from '@/helpers/formatDuration';
import { formatPlatform } from '@/helpers/formatPlatform';
import { formatTime } from '@/helpers/formatTime';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import { getLineColor } from '@/helpers/getLineColor';
import { isReplacementService } from '@/helpers/isReplacementService';
import type { DepartureResource, MotisMode, StopoverResource } from '@/lib/traewelling';
import styles from './CheckInTripSummary.module.css';

export const CheckInTripSummary = ({
  departure,
  destination,
}: {
  departure: DepartureResource;
  destination: StopoverResource;
}) => {
  const arrivalPlatform = formatPlatform(destination.platform, departure.line.mode);
  const arrivalTime = destination.arrivalReal ?? destination.arrivalPlanned;
  const departurePlatform = formatPlatform(departure.platform, departure.line.mode);
  const departureTime = getDepartureTime(departure);

  return (
    <ColoredLayer color={getLineColor(departure.line) ?? 'var(--via-fg-primary)'} radius="1rem">
      <ColoredLayer.Content className={styles.base}>
        <header className={styles.header}>
          <TransportModeIcon
            height={20}
            icon={isReplacementService(departure) ? 'replacement-bus' : undefined}
            mode={departure.line.mode ?? undefined}
            width={20}
          />

          <LineBadge
            backgroundColor={departure.line.color ?? undefined}
            className={styles.lineBadge}
            color={departure.line.textColor ?? undefined}
            journeyNumber={departure.line.fahrtNr}
            mode={departure.line.mode as MotisMode | undefined}
            name={departure.line.name}
            productName={departure.line.product ?? undefined}
          />

          <Marquee className={styles.direction}>{cleanStationName(departure.direction)}</Marquee>
        </header>

        <div className={styles.times}>
          <time className={styles.time} dateTime={departureTime}>
            {formatTime(departureTime)}
          </time>

          {arrivalTime && <span className={styles.duration}>{formatDuration(departureTime, arrivalTime)}</span>}

          {arrivalTime && (
            <time className={clsx(styles.time, styles.arrival)} dateTime={arrivalTime}>
              {formatTime(arrivalTime)}
            </time>
          )}
        </div>

        <TripLine className={styles.tripLine} orientation="horizontal">
          <TripLine.StopIndicator />
          <TripLine.RouteSegment />
          <IconArrowRight className={styles.arrow} size={16} stroke={2} />
          <TripLine.RouteSegment />
          <TripLine.StopIndicator />
        </TripLine>

        <div className={styles.row}>
          <Marquee className={styles.station}>{cleanStationName(departure.station.name)}</Marquee>
          <Marquee className={clsx(styles.station, styles.arrival)}>
            {cleanStationName(destination.station.name)}
          </Marquee>
        </div>

        {(departurePlatform || arrivalPlatform) && (
          <div className={clsx(styles.row, styles.platforms)}>
            {departurePlatform && <span className={styles.platform}>{departurePlatform}</span>}
            {arrivalPlatform && <span className={clsx(styles.platform, styles.arrival)}>{arrivalPlatform}</span>}
          </div>
        )}
      </ColoredLayer.Content>
    </ColoredLayer>
  );
};
