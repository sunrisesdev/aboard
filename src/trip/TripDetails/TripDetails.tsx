'use client';

import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import { useCheckIn } from '@/checkin/useCheckIn';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { getTintedPalette } from '@/components/TintedSurface/getTintedPalette';
import { TintedSurface, tintedSurfaceFallbackColor } from '@/components/TintedSurface/TintedSurface';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatDateTime } from '@/helpers/formatDateTime';
import { formatDelay } from '@/helpers/formatDelay';
import { formatPlatform } from '@/helpers/formatPlatform';
import { getDelay } from '@/helpers/getDelay';
import { getDeparturePlatform } from '@/helpers/getDeparturePlatform';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import { getLineColors } from '@/helpers/getLineColors';
import { getLineContrastColor } from '@/helpers/getLineContrastColor';
import { isReplacementService } from '@/helpers/isReplacementService';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import { TripStopoverItem } from '@/trip/TripStopoverItem/TripStopoverItem';
import { TripStopoverItemSkeleton } from '@/trip/TripStopoverItemSkeleton/TripStopoverItemSkeleton';
import { useUser } from '@/user/useUser';
import styles from './TripDetails.module.css';

const skeletonStationWidths = ['16ch', '12ch', '20ch', '14ch', '18ch', '11ch', '15ch', '17ch'];

export const TripDetails = ({ departure, inDrawer = false }: { departure: DepartureResource; inDrawer?: boolean }) => {
  const { home } = useUser();
  const { dispatch, trip } = useCheckIn();
  const stopovers = useLastDefinedValue(trip.stopovers);

  const lineColor = getLineColors({ color: departure.line.color, mode: departure.line.mode }).background;
  const replacementService = isReplacementService(departure);
  const platform = formatPlatform(getDeparturePlatform(departure), departure.line.mode);
  const delay = getDelay(departure.plannedWhen, departure.when);

  // Starts in the text color of the card above, so the line continues seamlessly
  const connectingLine = (
    <TripLine className={styles.connectingLine}>
      <TripLine.RouteSegment
        style={{
          background: `linear-gradient(to bottom, ${getTintedPalette(lineColor ?? tintedSurfaceFallbackColor).foreground}, var(--via-trip-details-contrast))`,
        }}
      />
    </TripLine>
  );

  return (
    <div
      className={clsx(styles.base, inDrawer && styles.inDrawer)}
      style={{ '--via-trip-details-contrast': getLineContrastColor(lineColor) } as CSSProperties}
    >
      <TintedSurface color={lineColor} radius="1rem">
        <TintedSurface.Content className={styles.tripCard}>
          <header className={styles.header}>
            <TransportModeIcon
              height={20}
              icon={replacementService ? 'replacement-bus' : undefined}
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

            <Marquee className={styles.destination}>{cleanStationName(departure.direction)}</Marquee>
          </header>

          <div style={{ display: 'grid', gap: '0.625rem', gridTemplateColumns: '1.25rem minmax(0, 1fr)' }}>
            <TripLine>
              <TripLine.StopIndicator style={{ marginTop: '0.3125rem' }} />
              {!trip.error && <TripLine.RouteSegment />}
            </TripLine>

            <div style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                <Marquee className={styles.origin}>{cleanStationName(departure.station.name)}</Marquee>
                <span className={styles.time}>ab {formatDateTime(getDepartureTime(departure), 'time')}</span>
              </div>

              {(platform || delay.minutes !== 0) && (
                <div className={styles.details}>
                  {platform && <span className={styles.platformBadge}>{platform}</span>}

                  {delay.minutes !== 0 && (
                    <span className={styles.delayBadge} data-via-delay={delay.status}>
                      {formatDelay(delay.minutes, { planned: departure.plannedWhen })}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </TintedSurface.Content>
      </TintedSurface>

      {trip.isLoading ? (
        <>
          {connectingLine}

          <div className={styles.stopoversCard}>
            <ul className={styles.stopovers}>
              {skeletonStationWidths.map((stationWidth, index) => (
                <li key={index}>
                  <TripStopoverItemSkeleton
                    last={index === skeletonStationWidths.length - 1}
                    stationWidth={stationWidth}
                  />
                </li>
              ))}
            </ul>

            <footer className={styles.footer}>Wähle deine Zielhaltestelle aus dem Fahrtverlauf.</footer>
          </div>
        </>
      ) : trip.error ? (
        <p>Die Halte konnten nicht geladen werden.</p>
      ) : (
        stopovers && (
          <>
            {connectingLine}

            <div className={styles.stopoversCard}>
              <ul className={styles.stopovers}>
                {stopovers.map((stopover, index) => (
                  <li key={stopover.uuid ?? stopover.id}>
                    <TripStopoverItem
                      home={!!home && home.id === stopover.station.id}
                      last={index === stopovers.length - 1}
                      mode={departure.line.mode?.toUpperCase() as MotisMode}
                      onSelect={(destination) => dispatch({ type: 'selectDestination', destination })}
                      stopover={stopover}
                    />
                  </li>
                ))}
              </ul>

              <footer className={styles.footer}>Wähle deine Zielhaltestelle aus dem Fahrtverlauf.</footer>
            </div>
          </>
        )
      )}
    </div>
  );
};
