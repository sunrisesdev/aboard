'use client';

import { useEffect, useState } from 'react';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { Marquee } from '@/components/Marquee/Marquee';
import { SubtleTintedSurface } from '@/components/TintedSurface/SubtleTintedSurface';
import { cleanStationName } from '@/helpers/cleanStationName';
import { getDepartureTime } from '@/helpers/getDepartureTime';
import { getLineColors } from '@/helpers/getLineColors';
import type { DepartureResource, MotisMode } from '@/lib/traewelling';
import { usePinnedLines } from '@/station/usePinnedLines';
import styles from './PinnedLines.module.css';

const departuresPerLine = 2;
const maxMinutesUntilDeparture = 20;

function getDepartureMinute(departure: DepartureResource) {
  return new Date(getDepartureTime(departure)).setSeconds(0, 0);
}

function getMinutesUntil(departure: DepartureResource, referenceMinute: number) {
  return (getDepartureMinute(departure) - referenceMinute) / 60_000;
}

// Keeps the remaining minutes up to date
function useCurrentMinute() {
  const [currentMinute, setCurrentMinute] = useState(() => new Date().setSeconds(0, 0));

  useEffect(() => {
    const interval = setInterval(() => setCurrentMinute(new Date().setSeconds(0, 0)), 60_000);

    return () => clearInterval(interval);
  }, []);

  return currentMinute;
}

export const PinnedLines = ({
  departures,
  onSelect,
  requestedTime,
  stationId,
}: {
  departures: DepartureResource[];
  onSelect: (departure: DepartureResource) => void;
  requestedTime: string | undefined;
  stationId: string;
}) => {
  const { pinnedLines } = usePinnedLines(stationId);
  const currentMinute = useCurrentMinute();
  const referenceMinute = requestedTime ? new Date(requestedTime).setSeconds(0, 0) : currentMinute;

  // Grouped by direction as well, so each card has a single destination
  const lines = new Map<string, DepartureResource[]>();
  const upcomingDepartures = departures
    .filter(
      (departure) =>
        departure.line.name
        && pinnedLines.includes(departure.line.name)
        && getMinutesUntil(departure, referenceMinute) >= 0,
    )
    .toSorted((a, b) => getDepartureMinute(a) - getDepartureMinute(b));

  for (const departure of upcomingDepartures) {
    const key = `${departure.line.name}|${departure.direction}`;
    const lineDepartures = lines.get(key) ?? [];

    if (lineDepartures.length >= departuresPerLine) continue;
    // The next departure is always shown, no matter how far away
    if (lineDepartures.length && getMinutesUntil(departure, referenceMinute) > maxMinutesUntilDeparture) continue;

    lines.set(key, [...lineDepartures, departure]);
  }

  if (!lines.size) return null;

  return (
    <div className={styles.base}>
      {[...lines].map(([key, lineDepartures]) => {
        const [{ direction, line }] = lineDepartures;

        return (
          <SubtleTintedSurface
            className={styles.line}
            color={getLineColors({ color: line.color, mode: line.mode }).background}
            key={key}
            radius="0.875rem"
          >
            <SubtleTintedSurface.Content className={styles.card}>
              <header className={styles.header}>
                <LineBadge
                  backgroundColor={line.color ?? undefined}
                  color={line.textColor ?? undefined}
                  journeyNumber={line.fahrtNr}
                  mode={line.mode as MotisMode | undefined}
                  name={line.name}
                  productName={line.product ?? undefined}
                />
                <Marquee className={styles.direction}>{cleanStationName(direction)}</Marquee>
              </header>

              <div className={styles.departures}>
                {lineDepartures.map((departure) => (
                  <button
                    className={styles.departure}
                    data-via-cancelled={departure.cancelled || undefined}
                    key={departure.tripId}
                    onClick={() => onSelect(departure)}
                    type="button"
                  >
                    {getMinutesUntil(departure, referenceMinute)}
                    <span className={styles.unit}>min</span>
                  </button>
                ))}
              </div>
            </SubtleTintedSurface.Content>
          </SubtleTintedSurface>
        );
      })}
    </div>
  );
};
