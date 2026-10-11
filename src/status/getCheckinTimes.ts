import type { TransportResource } from '@/lib/traewelling';

// Manual times entered by the user take precedence over live data
export function getCheckinTimes({ destination, manualArrival, manualDeparture, origin }: TransportResource) {
  return {
    arrival: manualArrival ?? destination.arrivalReal ?? destination.arrivalPlanned,
    departure: manualDeparture ?? origin.departureReal ?? origin.departurePlanned,
  };
}
