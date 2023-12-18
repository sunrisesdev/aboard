import { AboardStation, AboardTrip } from '@/types/aboard';

export type TripProps = {
  onClick?: () => void;
  requestedStationName?: string;
  trip: AboardTrip;
};

export type TripSelectorProps = {
  onSelect: (value: AboardTrip) => void;
  requestedStation?: AboardStation;
  trips: AboardTrip[];
};
