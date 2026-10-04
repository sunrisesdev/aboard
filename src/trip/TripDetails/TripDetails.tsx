'use client';

import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import { useCheckIn } from '@/checkin/useCheckIn';
import { ColoredLayer } from '@/components/ColoredLayer/ColoredLayer';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { TransportModeIcon } from '@/components/TransportModeIcon/TransportModeIcon';
import { TripLine } from '@/components/TripLine/TripLine';
import { cleanStationName } from '@/helpers/cleanStationName';
import { formatPlatform } from '@/helpers/formatPlatform';
import { formatTime } from '@/helpers/formatTime';
import { getDelay } from '@/helpers/getDelay';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import { getLineColor } from '@/helpers/getLineColor';
import { getLineContrastColor } from '@/helpers/getLineContrastColor';
import { isReplacementService } from '@/helpers/isReplacementService';
import { useLastDefinedValue } from '@/hooks/useLastDefinedValue';
import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import { TripStopoverItem } from '../TripStopoverItem/TripStopoverItem';
import styles from './TripDetails.module.css';

export const TripDetails = ({ departure, inDrawer = false }: { departure: DepartureResource; inDrawer?: boolean }) => {
  const { dispatch, trip } = useCheckIn();
  const stopovers = useLastDefinedValue(trip.stopovers);

  const lineColor = getLineColor(departure.line);
  const replacementService = isReplacementService(departure);
  const platform = formatPlatform(departure.platform, departure.line.mode);
  const delay = getDelay(departure.plannedWhen, departure.when);

  return (
    <div
      className={clsx(styles.base, inDrawer && styles.inDrawer)}
      style={{ '--via-trip-details-contrast': getLineContrastColor(lineColor) } as CSSProperties}
    >
      <ColoredLayer color={lineColor ?? 'var(--via-fg-primary)'} radius="1rem">
        <ColoredLayer.Content className={styles.tripCard}>
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
              {!trip.isLoading && !trip.error && <TripLine.RouteSegment />}
            </TripLine>

            <div style={{ paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
                <Marquee className={styles.origin}>{cleanStationName(departure.station.name)}</Marquee>
                <span className={styles.time}>ab {formatTime(getDepartureTime(departure))}</span>
              </div>

              {(platform || delay.minutes !== 0) && (
                <div className={styles.details}>
                  {platform && <span className={styles.platform}>{platform}</span>}

                  {delay.minutes !== 0 && (
                    <span className={styles.delayBadge} data-via-delay={delay.status}>
                      {`${delay.minutes > 0 ? '+' : '−'}${Math.abs(delay.minutes)} · statt ${formatTime(departure.plannedWhen)}`}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </ColoredLayer.Content>
      </ColoredLayer>

      {trip.isLoading ? (
        <ul className={styles.stopovers}>
          {Array.from({ length: 8 }, (_, index) => (
            <li key={index}>
              <Skeleton width="100%" height="1.25rem" />
            </li>
          ))}
        </ul>
      ) : trip.error ? (
        <p>Die Halte konnten nicht geladen werden.</p>
      ) : (
        stopovers && (
          <>
            <TripLine className={styles.connectingLine}>
              <TripLine.RouteSegment
                style={{
                  background: `linear-gradient(to bottom, contrast-color(${lineColor ?? 'var(--via-fg-primary)'}), var(--via-trip-details-contrast))`,
                }}
              />
            </TripLine>

            <div className={styles.stopoversCard}>
              <ul className={styles.stopovers}>
                {stopovers.map((stopover, index) => (
                  <li key={stopover.uuid ?? stopover.id}>
                    <TripStopoverItem
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
