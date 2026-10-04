'use client';

import ky from 'ky';
import { Fragment, useState } from 'react';
import { useCheckIn } from '@/checkin/useCheckIn';
import { Button } from '@/components/Button/Button';
import type { DepartureResource, TravelType } from '@/lib/traewelling';
import { DepartureTripItem } from '@/station/DepartureTripItem/DepartureTripItem';
import { groupByDepartureTime } from './groupByDepartureTime';
import styles from './Stationboard.module.css';
import { useStationboard } from './useStationboard';
import { type DepartureCursors, useStationboardReducer } from './useStationboardReducer';

function fetchDepartures(
  stationId: string,
  { requestedTime, travelType }: { requestedTime: string; travelType: TravelType | undefined },
) {
  const searchParams: Record<string, string> = { when: requestedTime };

  if (travelType) searchParams.travelType = travelType;

  return ky.get(`/api/station/${stationId}/departures`, { searchParams }).json<{
    data: DepartureResource[];
    meta: { times: DepartureCursors };
  }>();
}

// Uses the native History API, which keeps Next's search params in sync without a server render.
function replaceRequestedTime(requestedTime: string) {
  const url = new URL(window.location.href);

  url.searchParams.set('at', requestedTime);
  window.history.replaceState(null, '', url);
}

export const Stationboard = ({
  initialCursors,
  initialDepartures,
  stationId,
  travelType,
}: {
  initialCursors: DepartureCursors;
  initialDepartures: DepartureResource[];
  stationId: string;
  travelType: TravelType | undefined;
}) => {
  const [{ departures, nextCursor, previousCursor }, dispatch] = useStationboardReducer({
    initialCursors,
    initialDepartures,
  });
  const { isPending } = useStationboard();
  const { dispatch: checkInDispatch } = useCheckIn();
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);

  const loadEarlier = async () => {
    if (loadingEarlier) return;

    setLoadingEarlier(true);

    try {
      const { data, meta } = await fetchDepartures(stationId, { requestedTime: previousCursor, travelType });

      dispatch({ type: 'prepend', cursors: meta.times, departures: data });
      replaceRequestedTime(previousCursor);
    } finally {
      setLoadingEarlier(false);
    }
  };

  const loadLater = async () => {
    if (loadingLater) return;

    setLoadingLater(true);

    try {
      const { data, meta } = await fetchDepartures(stationId, { requestedTime: nextCursor, travelType });

      dispatch({ type: 'append', cursors: meta.times, departures: data });
      replaceRequestedTime(nextCursor);
    } finally {
      setLoadingLater(false);
    }
  };

  const departureGroups = groupByDepartureTime(departures);
  const nowMinute = new Date().setSeconds(0, 0);
  const upcomingIndex = departureGroups.findIndex(({ time }) => time >= nowMinute);
  const nowDividerIndex = upcomingIndex === -1 ? departureGroups.length : upcomingIndex;
  const nowDivider = (
    <li className={styles.nowDivider}>
      <span>Jetzt</span>
    </li>
  );

  return (
    <div className={styles.base}>
      <Button
        className={styles.loadMore}
        disabled={loadingEarlier}
        onClick={loadEarlier}
        style={{ marginBottom: '1rem' }}
      >
        {loadingEarlier ? 'Lädt…' : 'Frühere Abfahrten laden'}
      </Button>

      <ul className={styles.departures} data-via-pending={isPending || undefined}>
        {departureGroups.map(({ time, label, groups }, index) => (
          <Fragment key={time}>
            {index === nowDividerIndex && nowDivider}

            <li className={styles.departureGroup}>
              <time className={styles.groupLabel} dateTime={new Date(time).toISOString()}>
                {label}
              </time>

              <div className={styles.groupItems}>
                {groups.map((group) => (
                  <Fragment key={group[0].tripId}>
                    {group.length > 1 ? (
                      <div className={styles.splitTrain}>
                        {group.map((departure, splitTrainIndex) => (
                          <DepartureTripItem
                            departure={departure}
                            key={departure.tripId}
                            lessInformation={splitTrainIndex > 0}
                            onSelect={() => checkInDispatch({ type: 'selectDeparture', departure })}
                            stationId={stationId}
                          />
                        ))}
                      </div>
                    ) : (
                      <DepartureTripItem
                        departure={group[0]}
                        onSelect={() => checkInDispatch({ type: 'selectDeparture', departure: group[0] })}
                        stationId={stationId}
                      />
                    )}

                    <hr />
                  </Fragment>
                ))}
              </div>
            </li>
          </Fragment>
        ))}

        {nowDividerIndex === departureGroups.length && nowDivider}
      </ul>

      <Button className={styles.loadMore} disabled={loadingLater} onClick={loadLater} style={{ marginTop: '1rem' }}>
        {loadingLater ? 'Lädt…' : 'Spätere Abfahrten laden'}
      </Button>
    </div>
  );
};
