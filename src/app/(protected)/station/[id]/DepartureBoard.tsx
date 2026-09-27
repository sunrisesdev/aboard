'use client';

import ky from 'ky';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/Button/Button';
import { LineBadge } from '@/components/LineBadge/LineBadge';
import { formatTime } from '@/helpers/formatTime';
import type { DepartureResource } from '@/lib/traewelling';
import styles from './StationBoard.module.css';

const TRANSPORT_SYMBOLS: Record<string, string> = {
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

function getTransportSymbol(mode: string | null | undefined): string | undefined {
  const name = mode ? TRANSPORT_SYMBOLS[mode.toUpperCase()] : undefined;
  return name ? `/symbols/${name}.svg` : undefined;
}

function toDatetimeLocalValue(value: string): string {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function updateAtParam(when: string | undefined) {
  const url = new URL(window.location.href);
  if (when) {
    url.searchParams.set('at', when);
  } else {
    url.searchParams.delete('at');
  }
  window.history.replaceState(null, '', url);
}

function fetchDepartures(id: string, when?: string) {
  return ky.get(`/api/station/${id}/departures`, { searchParams: when ? { when } : undefined }).json<{
    data: DepartureResource[];
    meta: { times: { now: string; prev: string; next: string } };
  }>();
}

export function DepartureBoard({
  id,
  initialDepartures,
  initialTimes,
  initialAt,
}: {
  id: string;
  initialDepartures: DepartureResource[];
  initialTimes: { now: string; prev: string; next: string };
  initialAt: string | undefined;
}) {
  const [departures, setDepartures] = useState(initialDepartures);
  const [prevCursor, setPrevCursor] = useState(initialTimes.prev);
  const [nextCursor, setNextCursor] = useState(initialTimes.next);
  const [anchor, setAnchor] = useState(initialAt ?? initialTimes.now);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);
  const [jumping, setJumping] = useState(false);

  const loadEarlier = async () => {
    if (loadingEarlier) return;
    setLoadingEarlier(true);
    try {
      const when = prevCursor;
      const { data, meta } = await fetchDepartures(id, when);
      setDepartures((current) => [
        ...data,
        ...current.filter((departure) => !data.some((d) => d.tripId === departure.tripId)),
      ]);
      setPrevCursor(meta.times.prev);
      setAnchor(when);
      updateAtParam(when);
    } finally {
      setLoadingEarlier(false);
    }
  };

  const loadLater = async () => {
    if (loadingLater) return;
    setLoadingLater(true);
    try {
      const when = nextCursor;
      const { data, meta } = await fetchDepartures(id, when);
      setDepartures((current) => [
        ...current.filter((departure) => !data.some((d) => d.tripId === departure.tripId)),
        ...data,
      ]);
      setNextCursor(meta.times.next);
      setAnchor(when);
      updateAtParam(when);
    } finally {
      setLoadingLater(false);
    }
  };

  const jumpTo = async (localValue?: string) => {
    if (jumping) return;
    const when = localValue ? new Date(localValue).toISOString() : undefined;
    setJumping(true);
    try {
      const { data, meta } = await fetchDepartures(id, when);
      setDepartures(data);
      setPrevCursor(meta.times.prev);
      setNextCursor(meta.times.next);
      setAnchor(when ?? meta.times.now);
      updateAtParam(when);
    } finally {
      setJumping(false);
    }
  };

  return (
    <>
      <input
        type="datetime-local"
        className={styles.picker}
        value={toDatetimeLocalValue(anchor)}
        disabled={jumping}
        onChange={(event) => jumpTo(event.target.value)}
      />
      <Button disabled={jumping} onClick={() => jumpTo()}>
        Jetzt
      </Button>

      <Button className={styles.loadMore} disabled={loadingEarlier} onClick={loadEarlier}>
        {loadingEarlier ? 'Lädt…' : 'Frühere Abfahrten laden'}
      </Button>

      <ul className={styles.list}>
        {[...departures]
          .sort((a, b) => new Date(a.plannedWhen ?? a.when).getTime() - new Date(b.plannedWhen ?? b.when).getTime())
          .map((departure) => {
            const time = departure.when ?? departure.plannedWhen;
            const symbol = getTransportSymbol(departure.line.mode);
            const tripHref = `/trip/${encodeURIComponent(departure.tripId)}?${new URLSearchParams({
              station: String(departure.station.id),
              time: formatTime(time),
              line: departure.line.name ?? '',
            }).toString()}`;
            return (
              <li key={departure.tripId}>
                <Link href={tripHref} className={styles.row}>
                  {symbol && <Image src={symbol} alt="" className={styles.symbol} width={20} height={20} />}
                  <LineBadge
                    name={departure.line.name ?? ''}
                    color={departure.line.color}
                    textColor={departure.line.textColor}
                  />
                  <span className={styles.direction}>
                    {departure.direction}
                    {departure.station.id !== Number(id) && (
                      <span className={styles.origin}>ab {departure.station.name}</span>
                    )}
                  </span>
                  {departure.plannedWhen && departure.plannedWhen !== time && (
                    <s>{formatTime(departure.plannedWhen)}</s>
                  )}
                  <time dateTime={time}>{formatTime(time)}</time>
                  {departure.platform && <span>Gleis {departure.platform}</span>}
                  {departure.cancelled && <span className={styles.cancelled}>Ausfall</span>}
                </Link>
              </li>
            );
          })}
      </ul>

      <Button className={styles.loadMore} disabled={loadingLater} onClick={loadLater}>
        {loadingLater ? 'Lädt…' : 'Spätere Abfahrten laden'}
      </Button>
    </>
  );
}
