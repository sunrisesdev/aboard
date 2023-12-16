import { AboardTrip } from '@/types/aboard';

export type TripProps = {
  onClick: () => void;
  selectedStationName: string;
  trip: AboardTrip;
};
