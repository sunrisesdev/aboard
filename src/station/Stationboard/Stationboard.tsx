'use client';

import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import ky from 'ky';
import { Fragment, useState } from 'react';
import { Button } from '@/components/Button/Button';
import type { DepartureResource, TravelType } from '@/lib/traewelling';
import { DepartureTripItem } from '@/station/DepartureTripItem/DepartureTripItem';
import { groupByDepartureTime } from './groupByDepartureTime';
import styles from './Stationboard.module.css';
import { type DepartureCursors, useStationboardReducer } from './useStationboardReducer';

const travelTypeLabels: Record<TravelType, string> = {
  express: 'Fernzug',
  regional: 'Regionalzug',
  suburban: 'S-Bahn',
  subway: 'U-Bahn',
  tram: 'Tram',
  bus: 'Bus',
  ferry: 'Fähre',
  plane: 'Flug',
  taxi: 'Taxi',
};

function fetchDepartures(
  stationId: string,
  { requestedTime, travelType }: { requestedTime?: string; travelType?: TravelType },
) {
  const searchParams: Record<string, string> = {};

  if (requestedTime) searchParams.when = requestedTime;
  if (travelType) searchParams.travelType = travelType;

  return ky.get(`/api/station/${stationId}/departures`, { searchParams }).json<{
    data: DepartureResource[];
    meta: { times: DepartureCursors };
  }>();
}

function toDatetimeLocalValue(value: string): string {
  const date = new Date(value);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return local.toISOString().slice(0, 16);
}

function updateSearchParam(name: string, value: string | undefined) {
  const url = new URL(window.location.href);

  if (value) {
    url.searchParams.set(name, value);
  } else {
    url.searchParams.delete(name);
  }

  window.history.replaceState(null, '', url);
}

export const Stationboard = ({
  availableTravelTypes,
  initialCursors,
  initialDepartures,
  initialRequestedTime,
  initialTravelType,
  stationId,
}: {
  availableTravelTypes: TravelType[];
  initialCursors: DepartureCursors;
  initialDepartures: DepartureResource[];
  initialRequestedTime: string | undefined;
  initialTravelType: TravelType | undefined;
  stationId: string;
}) => {
  const [{ anchor, departures, knownTravelTypes, nextCursor, previousCursor, requestedTime, travelType }, dispatch] =
    useStationboardReducer({
      availableTravelTypes,
      initialCursors,
      initialDepartures,
      initialRequestedTime,
      initialTravelType,
    });
  const [jumping, setJumping] = useState(false);
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [loadingLater, setLoadingLater] = useState(false);

  const travelTypeOptions = (Object.keys(travelTypeLabels) as TravelType[]).filter((type) =>
    knownTravelTypes.includes(type),
  );

  const departureGroups = groupByDepartureTime(departures);
  const nowMinute = new Date().setSeconds(0, 0);
  const upcomingIndex = departureGroups.findIndex(({ time }) => time >= nowMinute);
  const nowDividerIndex = upcomingIndex === -1 ? departureGroups.length : upcomingIndex;
  const nowDivider = (
    <li className={styles.nowDivider}>
      <span>Jetzt</span>
    </li>
  );

  const loadEarlier = async () => {
    if (loadingEarlier) return;

    setLoadingEarlier(true);

    try {
      const { data, meta } = await fetchDepartures(stationId, { requestedTime: previousCursor, travelType });

      dispatch({ type: 'prepend', cursors: meta.times, departures: data, requestedTime: previousCursor });
      updateSearchParam('at', previousCursor);
    } finally {
      setLoadingEarlier(false);
    }
  };

  const loadLater = async () => {
    if (loadingLater) return;

    setLoadingLater(true);

    try {
      const { data, meta } = await fetchDepartures(stationId, { requestedTime: nextCursor, travelType });

      dispatch({ type: 'append', cursors: meta.times, departures: data, requestedTime: nextCursor });
      updateSearchParam('at', nextCursor);
    } finally {
      setLoadingLater(false);
    }
  };

  const reload = async (nextRequestedTime: string | undefined, nextTravelType: TravelType | undefined) => {
    if (jumping) return;

    setJumping(true);

    try {
      const { data, meta } = await fetchDepartures(stationId, {
        requestedTime: nextRequestedTime,
        travelType: nextTravelType,
      });

      dispatch({
        type: 'replace',
        cursors: meta.times,
        departures: data,
        requestedTime: nextRequestedTime,
        travelType: nextTravelType,
      });
      updateSearchParam('at', nextRequestedTime);
      updateSearchParam('travelType', nextTravelType);
    } finally {
      setJumping(false);
    }
  };

  const jumpTo = (localValue?: string) =>
    reload(localValue ? new Date(localValue).toISOString() : undefined, travelType);

  return (
    <>
      {travelTypeOptions.length > 1 && (
        <ToggleGroup
          className={styles.filterGroup}
          value={travelType ? [travelType] : []}
          onValueChange={([next]) => reload(requestedTime, next)}
          disabled={jumping}
          aria-label="Verkehrsmittel"
        >
          {travelTypeOptions.map((type) => (
            <Toggle key={type} value={type} className={styles.filterToggle}>
              {travelTypeLabels[type]}
            </Toggle>
          ))}
        </ToggleGroup>
      )}

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

      <ul className={styles.departures}>
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
                            stationId={stationId}
                          />
                        ))}
                      </div>
                    ) : (
                      <DepartureTripItem departure={group[0]} stationId={stationId} />
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

      <Button className={styles.loadMore} disabled={loadingLater} onClick={loadLater}>
        {loadingLater ? 'Lädt…' : 'Spätere Abfahrten laden'}
      </Button>
    </>
  );
};
