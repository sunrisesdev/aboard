"use client";

import { useState } from "react";
import { CheckInBottomDrawer } from "@/checkin/CheckInBottomDrawer/CheckInBottomDrawer";
import { cleanStationName } from "@/helpers/cleanStationName";
import { formatTime } from "@/helpers/formatTime";
import type { StopoverResource } from "@/lib/traewelling";

export function TripStopoverList({
  tripId,
  lineName,
  destinationName,
  startStation,
  stopovers,
}: {
  tripId: string;
  lineName: string;
  destinationName: string;
  startStation: StopoverResource;
  stopovers: StopoverResource[];
}) {
  const [endStation, setEndStation] = useState<StopoverResource>();

  return (
    <>
      <ul>
        {stopovers.map((stopover) => {
          const time = stopover.arrivalReal ?? stopover.arrivalPlanned;

          return (
            <li key={stopover.uuid ?? stopover.id}>
              <button type="button" onClick={() => setEndStation(stopover)}>
                <span>{cleanStationName(stopover.station.name)}</span>
                {time && <time dateTime={time}>{formatTime(time)}</time>}
                {stopover.cancelled && <span>Ausfall</span>}
              </button>
            </li>
          );
        })}
      </ul>
      <CheckInBottomDrawer
        open={!!endStation}
        onOpenChange={(open) => {
          if (!open) setEndStation(undefined);
        }}
        tripId={tripId}
        lineName={lineName}
        destinationName={destinationName}
        startStation={startStation}
        endStation={endStation}
      />
    </>
  );
}
