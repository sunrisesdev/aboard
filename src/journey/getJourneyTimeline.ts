import type { StatusResource } from '@/lib/traewelling';
import { getCheckinTimes } from '@/status/getCheckinTimes';

export type JourneyTimelineStop = {
  type: 'stop';
  arrival?: StatusResource;
  departure?: StatusResource;
  shortTransferAfter?: boolean;
  shortTransferBefore?: boolean;
  station: StatusResource['checkin']['origin']['station'];
};

export type JourneyTimelineItem =
  | JourneyTimelineStop
  | { type: 'trip'; status: StatusResource }
  | { type: 'transfer'; short: boolean };

const shortTransferInMilliseconds = 60 * 60_000;

function getDepartureTimestamp({ checkin, createdAt }: StatusResource) {
  return new Date(getCheckinTimes(checkin).departure ?? createdAt).getTime();
}

function getTransfer(previous: StatusResource, next: StatusResource) {
  const { arrival } = getCheckinTimes(previous.checkin);
  const { departure } = getCheckinTimes(next.checkin);
  if (!arrival || !departure) return 'long';
  if (new Date(departure).getTime() - new Date(arrival).getTime() >= shortTransferInMilliseconds) return 'long';

  return previous.checkin.destination.station.id === next.checkin.origin.station.id ? 'continuation' : 'short';
}

// Orders the statuses by departure, each as a trip between two stops. A trip continuing within an hour from the
// station the previous one arrived at shares its stop.
export function getJourneyTimeline(statuses: StatusResource[]) {
  const items: JourneyTimelineItem[] = [];
  let previous: { status: StatusResource; stop: JourneyTimelineStop } | undefined;

  for (const status of [...statuses].sort((a, b) => getDepartureTimestamp(a) - getDepartureTimestamp(b))) {
    const transfer = previous && getTransfer(previous.status, status);

    if (previous && transfer === 'continuation') {
      previous.stop.departure = status;
    } else {
      if (previous) {
        previous.stop.shortTransferAfter = transfer === 'short';
        items.push({ type: 'transfer', short: transfer === 'short' });
      }

      items.push({
        type: 'stop',
        departure: status,
        shortTransferBefore: transfer === 'short',
        station: status.checkin.origin.station,
      });
    }

    const arrivalStop: JourneyTimelineStop = {
      type: 'stop',
      arrival: status,
      station: status.checkin.destination.station,
    };
    items.push({ type: 'trip', status }, arrivalStop);
    previous = { status, stop: arrivalStop };
  }

  return items;
}
