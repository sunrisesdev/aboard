"use client";

import {
  CheckInBottomDrawer,
  type StopStation,
} from "@/checkin/CheckInBottomDrawer/CheckInBottomDrawer";
import { formatTime } from "@/helpers/formatTime";
import { useState } from "react";

export type StopoverSummary = StopStation & {
  key: string;
  cancelled: boolean;
};

export function TripStopoverList({
  tripId,
  lineName,
  destinationName,
  departure,
  stopovers,
}: {
  tripId: string;
  lineName: string;
  destinationName: string;
  departure: StopStation;
  stopovers: StopoverSummary[];
}) {
  const [selected, setSelected] = useState<StopoverSummary | null>(null);
  const [lastSelected, setLastSelected] = useState<StopoverSummary | null>(
    null,
  );

  return (
    <>
      <ul>
        {stopovers.map((stopover) => {
          const time = stopover.actualAt ?? stopover.plannedAt;
          return (
            <li key={stopover.key}>
              <button
                type="button"
                onClick={() => {
                  setSelected(stopover);
                  setLastSelected(stopover);
                }}
              >
                <span>{stopover.stationName}</span>
                {time && <time dateTime={time}>{formatTime(time)}</time>}
                {stopover.cancelled && <span>Ausfall</span>}
              </button>
            </li>
          );
        })}
      </ul>
      {lastSelected && (
        <CheckInBottomDrawer
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSelected(null);
            }
          }}
          tripId={tripId}
          lineName={lineName}
          destinationName={destinationName}
          departure={departure}
          arrival={lastSelected}
        />
      )}
    </>
  );
}
