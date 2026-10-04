import type { StopoverResource } from '@/lib/traewelling';
import { formatTime } from './formatTime';

export function splitStopoversAtBoarding(
  stopovers: StopoverResource[],
  { stationId, time }: { stationId: string | undefined; time: string | undefined },
) {
  // Some lines loop back to the same station more than once, so the boarding
  // stopover can only be identified by station id alone when that id occurs
  // exactly once; otherwise the departure time disambiguates which occurrence
  // was actually boarded.
  const isBoardingStation = (stopover: StopoverResource) => String(stopover.station.id) === stationId;
  const boardingStationOccurrences = stopovers.filter(isBoardingStation).length;

  const boardingIndex =
    boardingStationOccurrences === 1
      ? stopovers.findIndex(isBoardingStation)
      : stopovers.findLastIndex(
          (stopover) =>
            isBoardingStation(stopover)
            && !!time
            && formatTime(stopover.departurePlanned ?? stopover.departureReal ?? '') === time,
        );

  return {
    boardingStopover: stopovers[boardingIndex] ?? stopovers[0],
    remainingStopovers: boardingIndex >= 0 ? stopovers.slice(boardingIndex + 1) : stopovers,
  };
}
